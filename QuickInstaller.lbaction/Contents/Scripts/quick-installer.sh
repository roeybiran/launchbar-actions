#!/bin/bash

# quick-installer
# https://github.com/roybrian

# set -x

red='\033[0;31m'
green='\033[0;32m'
magenta='\033[95m'
yellow='\033[93m'
blue='\033[34m'
nc='\033[0m'

msg0 () {
	echo -e "${green}${1}${nc}"
}

msg1 () {
	echo -e "${red}${1}${nc}"
}

# find_icon () {

# }

# ntf () {
# 	osascript <<-EOF
# 	on run {  }

# 	end run
# EOF
# }


do_download () {
	local dl_dir=$(mktemp -d) # create another temp dir to store the download
	cd "${dl_dir}" # cd to the dir so curl will download it to there
	
	echo -e "$greenDownloading $yellow${1} $greento temp directory $yellow${dl_dir}"
	
	curl -O -L "${1}"
	for download_file in "${dl_dir}"/*; do
		f="${download_file}" # assign the absolute path to the downloaded file to f
	done
}

do_unzip () {
	# create another temp dir to store the unzipped contents
	msg0 "Found zipped archive."
	local unzip_dir=$(mktemp -d)
	msg0 "Creating a temporary folder: ${unzip_dir}"
	msg0 "Unzipping: ${1}"
	cd "${unzip_dir}"
	unzip -q "${1}" -x "__MACOSX/*"
	# assign the absolute path to the unzipped dir back to f
	f="${unzip_dir}"
}

do_mount_dmg () {
	# surpress any license agreement dialogs
	# (https://superuser.com/questions/221136/bypass-a-licence-agreement-when-mounting-a-dmg-on-the-command-line)
	msg0 "Found DMG: ${1}. Mounting..."
	volume=$(yes | hdiutil attach -nobrowse "${1}" | cut -f 3 | tail -n 1) # save the volume's path to a variable, for subsequent unmounting
	volumes_array+=("${volume}") # and put it in an array
	f="${volume}" # assign f with absolute path to the m mounted volume
}

find_installer () {
	# if f is a folder (unzipped or mounted volume), find the executables
	# find any .app, .pkg (which can be either a folder or a file) or .dmg -- which aren't nested in any other .pkg or .app

	msg0 "Looking in folder ${1} for installation files."

	f=$(find -E "${1}" \( -iregex '^.*\.(app|pkg|dmg)/?$' -not -iregex '^.*\.(app|pkg|dmg)/.*$' \))
	if [[ -z "${f}" ]]; then
		osascript -e 'display notification "Could not find installation file. Exiting."'
		exit 0
	fi

	executables_count=$(printf "%s\n" "${f}" | wc -l | sed 's/^ *//') # checking for number of executables

	if [[ "${executables_count}" -gt 1 ]]; then # if there is more than one potential installer, this dialog will show - even if overrides were set
		f=$(osascript - "${f}" <<-EOF
			on run { theExecutablesList }
				set theExecutablesChoices to paragraphs of theExecutablesList
				tell application "Terminal"
					set theFile to choose from list theExecutablesChoices with prompt "Found more than one potential installer. Select the one to proceed with:"
				end tell
			return theFile
			end run
		EOF
		)
	fi


}

dialog () {
	

	if [[ "${f}" == *.[Aa][Pp][Pp] ]]; then
		
		action="Copy to Applications"
		# if an alias to the /Applications folder is present
		local containing_dir=$(dirname "${f}")
		if [[ -d "${containing_dir}"/Applications ]]; then
			override="install"
		fi

	elif [[ "${f}" == *.[Pp][Kk][Gg] ]]; then
		action="Use \"installer\""
	fi

	# when overrides are set, the following dialog will be bypassed
	if [[ -z "${override}" ]]; then
		action=$(osascript - "${f}" "${action}" <<-EOF
			on run { theFile, theAction }
				set theFile to theFile as text
				tell application "Terminal"
					set theAction to choose from list {theAction, "Open in Finder", "Reveal in Finder"} ¬
						with prompt "What would you like to do with " & quoted form of theFile & "?"
				end tell
				return theAction
			end run
		EOF
		)
	elif [[ "${override}" == "--reveal" ]]; then
		action="Reveal in Finder"
	elif [[ "${override}" == "--open" ]]; then
		action="Open in Finder"
	elif [[ "${override}" == "--install" ]]; then
			:
	fi
	
	# with this override set, script will take action based on the installer's extension
	# with no override, a dialog will show prompting the user to choose an action

	case "${action}" in
		"Open in Finder")
			open_app "${f}"
			;;
		"Reveal in Finder")
			reveal_app "${f}"
			;;
		"Use \"installer\"")
			use_installer "${f}"
			;;
		"Copy to Applications")
			copy_to_applications "${f}"
			;;
		"false")
			osascript -e 'display notification "User canceled."'
			process=false
			;;
		*)
			osascript -e 'display notification "Something went wrong."'
			process=false
			;;
	esac
}

open_app () {
	open "${1}"
	process=false
}

reveal_app () {
	open -R "${1}"
	process=false
}

copy_to_applications () {
	# using Finder to copy to the app /Applications works better than `cp`
	osascript - "${1}" <<-EOF
	on run { theApp }
		set theApp to POSIX file theApp
		set theApp to theApp as alias
		tell application "Finder"
			duplicate theApp to "Macintosh HD:Applications:"
		end tell
	end run
	EOF

	file_name=$(basename "${1}")

	if [[ $? -eq 0 ]]; then
		xattr -d com.apple.quarantine /Applications/"${file_name}"
		# open -R /Applications/"${file_name}"
		osascript -e "display notification \"Successfully installed ${file_name}\""
	fi

	process=false
}

use_installer () {
	sudo installer -pkg "${1}" -target /
	process=false
}

###

# name_of_me=$(basename "${BASH_SOURCE[0]}")
# path_to_my_parent="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )" # no trailing slash
# path_to_me="${path_to_my_parent}/${name_of_me}"

# osascript - "${path_to_me}" "${@}" <<-EOF
# on run { _this, _args }
# 	tell application "Terminal"
# 		activate
# 		do script "source " & quoted form of _this & _args
# 	end tell
# end run
# EOF

for f in "${@}"; do
	
	# process the argument until we have an installer
	process=true

	while [[ "${process}" == true ]]; do 
		if [[ "${f}" == "--open" ]] || [[ "${f}" == "--install" ]]; then
		 	override="${f}"
		 	break
		elif [[ "${f}" == *.[Aa][Pp][Pp] ]]; then
			dialog "${f}"
		elif [[ "${f}" == *.[Pp][Kk][Gg] ]]; then
			use_installer "${f}"
		elif [[ "${f}" == [Hh][Tt][Tt][Pp]* ]]; then
			do_download "${f}"
		elif [[ "${f}" == *.[Zz][Ii][Pp] ]]; then
			do_unzip "${f}"
		elif [[ "${f}" == *.[Dd][Mm][Gg] ]]; then
			do_mount_dmg "${f}"
		elif [[ -d "${f}" ]]; then
			find_installer "${f}"
		fi
	done

done

# unmounting any volumes
if [[ "${#volumes_array[@]}" -gt 0 ]]; then
	# if the installer was revealed/opened in Finder
	if [[ "${action}" == *"Finder" ]]; then
		osascript <<-EOF
		on run
			display alert "Quick Installer" message "Choosing to open or reveal an installer in Finder keeps the volumes mounted, until this alert is dismissed."
		end run
		EOF
	fi

	for volume in "${volumes_array[@]}"; do
		osascript - "${volume}" <<-EOF
		on run { theVolume }
			set theVolume to POSIX file theVolume
			set theVolume to theVolume as alias
			tell application "Finder"
				eject disk theVolume
			end tell
		end run
		EOF
	done
fi

cd
