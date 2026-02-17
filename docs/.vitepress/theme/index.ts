import DefaultTheme from 'vitepress/theme'
import './custom.css'
import FTTag from '../../../src/components/FTTag/FTTag.vue'
import FTCheckbox from '../../../src/components/FTCheckbox/FTCheckbox.vue'
import FTRadio from '../../../src/components/FTRadio/FTRadio.vue'
import FTTooltip from '../../../src/components/FTTooltip/FTTooltip.vue'
import FTPaging from '../../../src/components/FTPaging/FTPaging.vue'
import FTSideMenu from '../../../src/components/FTSideMenu/FTSideMenu.vue'
import FTButton from '../../../src/components/FTButton/FTButton.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('FTButton', FTButton)
    app.component('FTTag', FTTag)
    app.component('FTCheckbox', FTCheckbox)
    app.component('FTRadio', FTRadio)
    app.component('FTTooltip', FTTooltip)
    app.component('FTPaging', FTPaging)
    app.component('FTSideMenu', FTSideMenu)
  }
}
