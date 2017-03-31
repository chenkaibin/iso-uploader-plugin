"""ISO Uploader plugin setup."""

import os

from otopi import plugin, util

from ovirt_engine_setup import constants as osetupcons
from ovirt_engine_setup.engine import constants as oenginecons


@util.export
class Plugin(plugin.PluginBase):
    """ISO Uploader plugin setup."""

    @plugin.event(
        stage=plugin.Stages.STAGE_CLOSEUP,
        after=(
            osetupcons.Stages.DIALOG_TITLES_E_SUMMARY,
        ),
        condition=lambda self: (
            self.environment[oenginecons.EngineDBEnv.NEW_DATABASE]
        ),
    )
    def enable_iso_uploader_plugin(self):
        os.system("sed -i '/^#passwd/c\passwd=%s' /etc/ovirt-engine/isouploader.conf"
            % self.environment[oenginecons.ConfigEnv.ADMIN_PASSWORD])
        os.system("sed -i '/^#user/c\user=admin@internal' /etc/ovirt-engine/isouploader.conf")
        os.system("chkconfig iso-uploader-plugin on")
        self.dialog.note(text="ISO Uploader plugin enabled.")

    @plugin.event(
        stage=plugin.Stages.STAGE_CLOSEUP,
        after=(
            osetupcons.Stages.DIALOG_TITLES_E_SUMMARY,
        ),
        condition=lambda self: (
            not self.environment[oenginecons.EngineDBEnv.NEW_DATABASE]
        ),
    )
    def restart_iso_uploader_plugin(self):
        os.system("service iso-uploader-plugin restart")
