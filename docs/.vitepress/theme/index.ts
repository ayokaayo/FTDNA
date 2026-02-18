import DefaultTheme from 'vitepress/theme'
import './custom.css'
import FTTag from '../../../src/components/FTTag/FTTag.vue'
import FTCheckbox from '../../../src/components/FTCheckbox/FTCheckbox.vue'
import FTRadio from '../../../src/components/FTRadio/FTRadio.vue'
import FTTooltip from '../../../src/components/FTTooltip/FTTooltip.vue'
import FTPaging from '../../../src/components/FTPaging/FTPaging.vue'
import FTButton from '../../../src/components/FTButton/FTButton.vue'
import FTToggle from '../../../src/components/FTToggle/FTToggle.vue'
import FTBreadcrumb from '../../../src/components/FTBreadcrumb/FTBreadcrumb.vue'
import FTPanel from '../../../src/components/FTPanel/FTPanel.vue'
import FTHeader from '../../../src/components/FTHeader/FTHeader.vue'
import FTSideMenu from '../../../src/components/FTSideMenu/FTSideMenu.vue'
import FTPageLayout from '../../../src/components/FTPageLayout/FTPageLayout.vue'
import FTLogo from '../../../src/components/FTLogo/FTLogo.vue'
import FTInput from '../../../src/components/FTInput/FTInput.vue'
import FTSelect from '../../../src/components/FTSelect/FTSelect.vue'
import FTTabs from '../../../src/components/FTTabs/FTTabs.vue'
import FTModal from '../../../src/components/FTModal/FTModal.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('FTButton', FTButton)
    app.component('FTTag', FTTag)
    app.component('FTCheckbox', FTCheckbox)
    app.component('FTRadio', FTRadio)
    app.component('FTTooltip', FTTooltip)
    app.component('FTPaging', FTPaging)
    app.component('FTToggle', FTToggle)
    app.component('FTBreadcrumb', FTBreadcrumb)
    app.component('FTPanel', FTPanel)
    app.component('FTHeader', FTHeader)
    app.component('FTSideMenu', FTSideMenu)
    app.component('FTPageLayout', FTPageLayout)
    app.component('FTLogo', FTLogo)
    app.component('FTInput', FTInput)
    app.component('FTSelect', FTSelect)
    app.component('FTTabs', FTTabs)
    app.component('FTModal', FTModal)
  }
}
