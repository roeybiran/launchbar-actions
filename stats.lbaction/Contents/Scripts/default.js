function run() {
  const lbOutput = [];
  // getting primary information from system_profiler
  const sysProfiler = LaunchBar.execute(
    "/usr/sbin/system_profiler",
    "-xml",
    "SPSoftwareDataType",
    "SPHardwareDataType",
    "SPStorageDataType",
    "SPNetworkDataType",
    "SPDisplaysDataType",
    "SPBluetoothDataType"
  );

  const arrayOfDataTypes = Plist.parse(sysProfiler);
  const softwareReport = arrayOfDataTypes[0]._items[0];
  const hardwareReport = arrayOfDataTypes[1]._items[0];
  const storageReport = arrayOfDataTypes[2]._items[0];
  const networkReport = arrayOfDataTypes[3]._items;
  const graphicsReport = arrayOfDataTypes[4]._items[0];
  const bluetoothReport = arrayOfDataTypes[5]._items[0];

  // File.writeText(JSON.stringify(bluetoothReport, null, 2), "~/Desktop/1.txt");

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
      icon: "font-awesome:fa-laptop",
    }
  );

  const serialNumber = hardwareReport.serial_number;
  lbOutput.push({
    title: serialNumber,
    subtitle: "Serial Number",
    icon: "barcode-solidTemplate.pdf",
  });

  // uptime
  const uptime = softwareReport.uptime.split(/:| /);
  const uptimeDays = uptime[1];
  const uptimeHours = uptime[2];
  const uptimeMins = uptime[3];
  lbOutput.push({
    title: `${uptimeDays} days, ${uptimeHours} hours, ${uptimeMins} minutes`,
    subtitle: "Uptime",
    icon: "font-awesome:fa-clock-o",
  });

  // cpu
  const cpuModel = hardwareReport.cpu_type;
  const cpuSpeed = hardwareReport.current_processor_speed;
  lbOutput.push({
    title: `${cpuSpeed} ${cpuModel}`,
    subtitle: "Processor",
    icon: "microchip-solidTemplate.pdf",
  });

  function formatBytes(bytes) {
    var marker = 1024; // Change to 1000 if required
    var decimal = 3; // Change as required
    var kiloBytes = marker; // One Kilobyte is 1024 bytes
    var megaBytes = marker * marker; // One MB is 1024 KB
    var gigaBytes = marker * marker * marker; // One GB is 1024 MB
    var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

    // return bytes if less than a KB
    if (bytes < kiloBytes) return bytes + " Bytes";
    // return KB if less than a MB
    else if (bytes < megaBytes)
      return (bytes / kiloBytes).toFixed(decimal) + " KB";
    // return MB if less than a GB
    else if (bytes < gigaBytes)
      return (bytes / megaBytes).toFixed(decimal) + " MB";
    // return GB if less than a TB
    else return (bytes / gigaBytes).toFixed(decimal) + " GB";
  }

  // memory
  // calculating used memory, as in Activity Monitor
  const physicalMemory = hardwareReport.physical_memory;
  const vmStat = LaunchBar.execute("/usr/bin/vm_stat");
  let totalUsedMem = 0;
  vmStat.split("\n").forEach((memory) => {
    const match = memory.match(
      /^(Pages occupied by compressor|Pages wired down|Anonymous pages):\s+(\d+)\.$/m
    );
    if (match) {
      // coerce to number
      // multiple by 4096 to convert 'Pages' to bytes
      totalUsedMem += parseInt(match[2], 10) * 4096;
    }
  });
  lbOutput.push({
    title: `${physicalMemory}, ${formatBytes(totalUsedMem)} used`,
    subtitle: "Memory",
    icon: "memory-solidTemplate.pdf",
  });

  // storage
  const startUpDiskName = storageReport._name;
  const humanReadableTotalSpace = formatBytes(storageReport.size_in_bytes);
  const humanReadableFreeSpace = formatBytes(storageReport.free_space_in_bytes);
  const storageHardware = storageReport.physical_drive.device_name;
  lbOutput.push({
    title: `${humanReadableTotalSpace}, ${humanReadableFreeSpace} free`,
    subtitle: `${startUpDiskName} (${storageHardware})`,
    icon: "font-awesome:fa-hdd-o",
  });

  // network
  let internalIp;
  let defaultGateway;
  let macAddress;
  networkReport.forEach((networkInterface) => {
    // checking for connectivity
    if (networkInterface._name === "Wi-Fi" && networkInterface.ip_address) {
      internalIp = networkInterface.ip_address[0];
      defaultGateway = networkInterface.dhcp.dhcp_routers;
      macAddress = networkInterface.Ethernet["MAC Address"];
      lbOutput.push(
        {
          title: defaultGateway,
          subtitle: "Default Gateway",
          icon: "ethernet-solidTemplate.pdf",
        },
        {
          title: macAddress,
          subtitle: "Wi-Fi MAC Address",
          icon: "macWifiTemplate.pdf",
        },
        {
          title: internalIp,
          subtitle: "Internal IP",
          icon: "network-wired-solidTemplate.pdf",
        }
      );
    }
  });

  const publicIp = LaunchBar.execute(
    "/usr/bin/dig",
    "+short",
    "myip.opendns.com",
    "@resolver1.opendns.com"
  );
  lbOutput.push({
    title: publicIp || "Error: Failed to obtain Public IP",
    subtitle: "External IP",
    icon: "globe-americas-solidTemplate.pdf",
  });

  // graphics
  const graphicsVram = graphicsReport._spdisplays_vram;
  const graphicsGpu = graphicsReport.sppci_model;
  lbOutput.push({
    title: `${graphicsGpu}, ${graphicsVram}`,
    subtitle: "Graphics",
    icon: "graphicsTemplate.pdf",
  });

  // bluetooth
  let bluetoothMacAdress =
    bluetoothReport.controller_properties.controller_address;
  bluetoothMacAdress = bluetoothMacAdress.replace(/-/g, ":").toLowerCase();
  lbOutput.push({
    title: bluetoothMacAdress,
    subtitle: "Bluetooth MAC Address",
    icon: "macBtTemplate.pdf",
  });

  return lbOutput.map((x) => {
    x.actionReturnsItems = false;
    x.actionRunsInBackground = true;
    return x;
  });
}
