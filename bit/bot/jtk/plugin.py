from zope.interface import implements
from zope.component import getUtility

from bit.core.interfaces import IPlugin
from bit.bot.common.interfaces import IResourceRegistry
from bit.bot.base.plugin import BotPlugin


class BotJTK(BotPlugin):
    implements(IPlugin)
    name = 'bit.bot.jtk'
    def load_JS(self):
        js = getUtility(IResourceRegistry,'js')
        js.add('jtk/jquery.jtk.js',{'rel':'link'})
