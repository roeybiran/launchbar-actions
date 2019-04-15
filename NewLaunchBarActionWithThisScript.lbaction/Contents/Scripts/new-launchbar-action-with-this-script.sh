#!/bin/sh
#
# LaunchBar Action Script
#

# <string>com.rb.LaunchBar.action.AirDropDiscovery</string>
# <key>LBAuthor</key>
# <string>Roey Biran</string>
# <key>LBEmail</key>
# <string>roeybiran@gmail.com</string>
# <key>LBTwitter</key>
# <string>RoeyBiran</string>
# <key>LBWebsiteURL</key>
# <string>github.com/roybrian</string>

# get the default script
script_path="${1}"

# compose basic info from the script's name
# get script's name+extension 
default_script=$(basename "${script_path}")
# for the .lbaction bundle
file_name="${default_script%.*}"
# camelizing the script's name for the action's identifier
action_identifier=$(perl -pe 's/(^|_| |-)./uc($&)/ge;s/_| |-//g' <<< "${file_name}")
# title-casing the script's name for the action's name
action_name=$(perl -pe 's/(^|_| |-)./uc($&)/ge;s/_| |-//g' <<< "${file_name}" | sed -e 's/\([^[:blank:]]\)\([[:upper:]]\)/\1 \2/g' | sed -e 's/\([^[:blank:]]\)\([[:upper:]]\)/\1 \2/g')

file=$(mktemp)

config="
*.title = New LaunchBar Action

action_icon.label = Icon
action_icon.type = textfield

action_name.label = Action Name
action_name.type = textfield
action_name.default = ${action_name}

action_file_name.label = File Name
action_file_name.type = textfield
action_file_name.default = ${file_name}.lbaction
action_file_name.disabled = 1

action_identifier.label = Identifier
action_identifier.type = textfield
action_identifier.default = com.github.roybrian.LB${action_identifier}

action_req_app.label = Required Application
action_req_app.type = textfield

action_asc_app.label = Associated Application
action_asc_app.type = textfield

action_text_input_title.label = Text Input Title
action_text_input_title.type = textfield

action_abbreviation.label = Abbreviation
action_abbreviation.type = textfield

debug_log.label = Debug Log
debug_log.type = checkbox
debug_log.default = 1

action_default_script.label = Default Script
action_default_script.type = textfield
action_default_script.default = ${default_script}
action_default_script.disabled = 1

run_in_background.label = Run in Background
run_in_background.type = checkbox

requires_arg.label = Requires Argument
requires_arg.type = checkbox

accepts_path_arg.label = Accepts Path Argument
accepts_path_arg.type = checkbox

accepts_str_arg.label = Accepts String Argument
accepts_str_arg.type = checkbox

keep_window_active.label = Keep Window Active
keep_window_active.type = checkbox

results_type.label = Results Type
results_type.type = popup
results_type.option = None
results_type.option = Item
results_type.option = String
results_type.option = Path
results_type.default = None

ok.type = defaultbutton
ok.label = OK
cancel.type = cancelbutton
cancel.label = Cancel"

echo "${config}" >> "${file}"

_dialog=$(/Applications/Pashua.app/Contents/MacOS/Pashua "${file}")

n=0
# get the values back from pashua, put into vars
while IFS= read -r line; do
	case "${line}" in
		"action_icon="*)
			_action_icon="${line#*=}"
			;;
		"action_name"=*)
			_action_name="${line#*=}"
			;;
		"action_identifier"=*)
			_action_identifier="${line#*=}"
			;;
		"action_req_app"=*)
			_action_req_app="${line#*=}"
			;;
		"action_asc_app"=*)
			_action_asc_app="${line#*=}"
			;;
		"action_text_input_title"=*)
			_action_text_input_title="${line#*=}"
			;;
		"action_abbreviation"=*)
			_action_abbreviation="${line#*=}"
			;;
		"debug_log"=*)
			_debug_log="${line#*=}"
			;;
		"run_in_background"=*)
			_run_in_background="${line#*=}"
			;;
		"requires_arg"=*)
			_requires_arg="${line#*=}"
			;;
		"accepts_path_arg"=*)
			_accepts_path_arg="${line#*=}"
			;;
		"accepts_str_arg"=*)
			_accepts_str_arg="${line#*=}"
			;;
	esac
	(( n++ ))
done <<< "${_dialog}"

# if cancel is pressed
if [[ "${n}" -eq 1 ]]; then
	exit 0
fi

if [[ -d "${HOME}/Library/Application Support/LaunchBar/Actions/${file_name}.lbaction" ]]; then
	osascript -e 'display notification "A similarly named action already exists"'
	exit 0
fi

target="${HOME}/Library/Application Support/LaunchBar/Actions/${file_name}.lbaction/Contents"

mkdir -p "${target}/Scripts"

plist="${target}/Info.plist"


# write the plist
/usr/libexec/PlistBuddy -c "Add CFBundleIconFile string ${_action_icon}" "${plist}"
/usr/libexec/PlistBuddy -c "Add CFBundleName string ${_action_name}" "${plist}"
/usr/libexec/PlistBuddy -c "Add CFBundleIdentifier string ${_action_identifier}" "${plist}"
/usr/libexec/PlistBuddy -c "Add CFBundleVersion string ${act_version}" "${plist}"
/usr/libexec/PlistBuddy -c "Add LBAbbreviation string ${_action_abbreviation}" "${plist}"
/usr/libexec/PlistBuddy -c "Add LBAssociatedApplication string ${_action_asc_app}" "${plist}"
/usr/libexec/PlistBuddy -c "Add LBDebugLogEnabled bool true" "${plist}"
/usr/libexec/PlistBuddy -c "Add LBDescription dict" "${plist}"
/usr/libexec/PlistBuddy -c "Add LBRequiredApplication string ${_action_req_app}" "${plist}"
/usr/libexec/PlistBuddy -c "Add LBTextInputTitle string ${_action_text_input_title}" "${plist}"
/usr/libexec/PlistBuddy -c "Add LBScripts dict" "${plist}"
/usr/libexec/PlistBuddy -c "Add LBScripts:LBDefaultScript dict" "${plist}"
/usr/libexec/PlistBuddy -c "Add LBScripts:LBDefaultScript:LBAcceptedArgumentTypes array" "${plist}"

if [[ "${_accepts_str_arg}" -eq 1 ]]; then
	/usr/libexec/PlistBuddy -c "Add LBScripts:LBDefaultScript:LBAcceptedArgumentTypes:0 string string" "${plist}"
fi

if [[ "${_accepts_path_arg}" -eq 1 ]]; then
	/usr/libexec/PlistBuddy -c "Add LBScripts:LBDefaultScript:LBAcceptedArgumentTypes:0 string path" "${plist}"
fi

if [[ "${_requires_arg}" -eq 1 ]]; then
	/usr/libexec/PlistBuddy -c "Add LBScripts:LBDefaultScript:LBRequiresArgument bool true" "${plist}"
else
	/usr/libexec/PlistBuddy -c "Add LBScripts:LBDefaultScript:LBRequiresArgument bool false" "${plist}"
fi

if [[ "${_debug_log}" -eq 1 ]]; then
	/usr/libexec/PlistBuddy -c "Add LBScripts:LBDebugLogEnabled bool true" "${plist}"
else
	/usr/libexec/PlistBuddy -c "Add LBScripts:LBDebugLogEnabled bool false" "${plist}"
fi

if [[ "${_run_in_background}" -eq 1 ]]; then
	/usr/libexec/PlistBuddy -c "Add LBScripts:LBRunInBackground bool true" "${plist}"
else
	/usr/libexec/PlistBuddy -c "Add LBScripts:LBRunInBackground bool false" "${plist}"
fi

/usr/libexec/PlistBuddy -c "Add LBScripts:LBDefaultScript:LBScriptName string ${default_script}" "${plist}"

mv "${script_path}" "${target}/Scripts"
