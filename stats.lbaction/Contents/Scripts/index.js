"use strict";

// eslint-disable-no-underscore-dangle
const plist = require("simple-plist");
const bytes = require("bytes");
const { execFile } = require("@roeybiran/task");

(async () => {
  // getting primary information from system_profiler
  try {
    const lbOutput = [];

    const { stdout } = await execFile("/usr/sbin/system_profiler", [
      "-xml",
      "SPSoftwareDataType",
      "SPHardwareDataType",
      "SPStorageDataType",
      "SPNetworkDataType",
      "SPDisplaysDataType",
      "SPBluetoothDataType"
    ]);
    const arrayOfDataTypes = plist.parse(stdout);

    const softwareReport = arrayOfDataTypes[0]._items[0];
    const hardwareReport = arrayOfDataTypes[1]._items[0];
    const storageReport = arrayOfDataTypes[2]._items[0];
    const networkReport = arrayOfDataTypes[3]._items;

    // host
    const osVersion = softwareReport.os_version;
    const localHostName = softwareReport.local_host_name;
    const machineName = hardwareReport.machine_name;
    const machineModel = hardwareReport.machine_model;
    lbOutput.push(
      { title: osVersion, icon: "font-awesome:fa-apple" },
      {
        title: `${machineName} (${machineModel})`,
        subtitle: localHostName,
        icon: "font-awesome:fa-laptop"
      }
    );

    const serialNumber = hardwareReport.serial_number;
    lbOutput.push({
      title: serialNumber,
      subtitle: "Serial Number",
      icon: "barcode-solidTemplate.pdf"
    });

    // uptime
    const uptime = softwareReport.uptime.split(/:| /);
    const uptimeDays = uptime[1];
    const uptimeHours = uptime[2];
    const uptimeMins = uptime[3];
    lbOutput.push({
      title: `${uptimeDays} days, ${uptimeHours} hours, ${uptimeMins} minutes`,
      subtitle: "Uptime",
      icon: "font-awesome:fa-clock-o"
    });

    // cpu
    const cpuModel = hardwareReport.cpu_type;
    const cpuSpeed = hardwareReport.current_processor_speed;
    lbOutput.push({
      title: `${cpuSpeed} ${cpuModel}`,
      subtitle: "Processor",
      icon: "microchip-solidTemplate.pdf"
    });

    // memory
    // calcutaing used memory, as in Activity Monitor
    const physicalMemory = hardwareReport.physical_memory;
    const vmStat = await execFile("vm_stat");
    let totalUsedMem = 0;
    vmStat.stdout.split("\n").forEach(memory => {
      const match = memory.match(
        /^(Pages occupied by compressor|Pages wired down|Anonymous pages):\s+(\d+)\.$/m
      );
      if (match) {
        // coerce to number
        // multiple by 4096 to convert 'Pages' to bytes
        totalUsedMem += parseInt(match[2], 10) * 4096;
      }
    });
    totalUsedMem = bytes.format(totalUsedMem);
    lbOutput.push({
      title: `${physicalMemory}, ${totalUsedMem} used`,
      subtitle: "Memory",
      icon: "memory-solidTemplate.pdf"
    });

    const startUpDiskName = storageReport._name;
    const humanReadableTotalSpace = bytes.format(storageReport.size_in_bytes);
    const humanReadableFreeSpace = bytes.format(
      storageReport.free_space_in_bytes
    );
    const storageHardware = storageReport.physical_drive.device_name;
    lbOutput.push({
      title: `${humanReadableTotalSpace}, ${humanReadableFreeSpace} free`,
      subtitle: `${startUpDiskName} (${storageHardware})`,
      icon: "font-awesome:fa-hdd-o"
    });

    // network
    let internalIp;
    let defaultGateway;
    let macAddress;
    networkReport.forEach(networkInterface => {
      // checking for connectivity
      if (networkInterface._name === "Wi-Fi" && networkInterface.ip_address) {
        internalIp = networkInterface.ip_address[0];
        defaultGateway = networkInterface.dhcp.dhcp_routers;
        macAddress = networkInterface.Ethernet["MAC Address"];
        lbOutput.push(
          {
            title: defaultGateway,
            subtitle: "Default Gateway",
            icon: "ethernet-solidTemplate.pdf"
          },
          {
            title: macAddress,
            subtitle: "Wi-Fi MAC Address",
            icon: "macWifiTemplate.pdf"
          },
          {
            title: internalIp,
            subtitle: "Internal IP",
            icon: "network-wired-solidTemplate.pdf"
          }
        );
      }
    });
    try {
      const publicIp = await execFile(
        "/usr/bin/curl",
        ["https://icanhazip.com/"],
        {
          timeout: 2000
        }
      );
      lbOutput.push({
        title: publicIp.stdout,
        subtitle: "External IP",
        icon: "globe-americas-solidTemplate.pdf"
      });
    } catch (error) {
      if (!error.code === "SIGTERM" || !error.code === 6) {
        console.log(error);
      }
    }

    // graphics
    const graphicsReport = arrayOfDataTypes[4]._items[0];
    const graphicsVram = graphicsReport.spdisplays_vram;
    const graphicsGpu = graphicsReport.sppci_model;
    lbOutput.push({
      title: `${graphicsGpu}, ${graphicsVram}`,
      subtitle: "Graphics",
      icon: "graphicsTemplate.pdf"
    });

    // bluetooth
    const bluetoothReport = arrayOfDataTypes[5]._items;
    let bluetoothMacAdress =
      bluetoothReport[0].local_device_title.general_address;
    bluetoothMacAdress = bluetoothMacAdress.replace(/-/g, ":").toLowerCase();
    lbOutput.push({
      title: bluetoothMacAdress,
      subtitle: "Bluetooth MAC Address",
      icon: "macBtTemplate.pdf"
    });

    return console.log(
      JSON.stringify(
        lbOutput.map(xParam => {
          const x = xParam;
          x.actionReturnsItems = false;
          x.actionRunsInBackground = true;
          return x;
        }),
        null,
        " "
      )
    );
  } catch (error) {
    return console.log(error);
  }
})();
