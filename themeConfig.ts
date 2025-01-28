import { defineThemeConfig } from '@core'
import { Skins } from '@core/enums'
import { breakpointsVuetify } from '@vueuse/core'
import { VIcon } from 'vuetify/components/VIcon'

// ❗ Logo SVG must be imported with ?raw suffix
import logo from '@images/logo.svg?raw'

import { AppContentLayoutNav, ContentWidth, FooterType, NavbarType } from '@layouts/enums'

export const { themeConfig, layoutConfig } = defineThemeConfig({
    app: {
        title: '',
        logo: h('div', { innerHTML: logo, style: 'line-height:0; color: rgb(var(--v-global-theme-primary))' }),
        contentWidth: ContentWidth.Fluid,
        contentLayoutNav: AppContentLayoutNav.Horizontal,
        overlayNavFromBreakpoint: breakpointsVuetify.md + 16, // 16 for scrollbar. Docs: https://next.vuetifyjs.com/en/features/display-and-platform/
        i18n: {
            enable: true,
            defaultLocale: 'fa',
            langConfig: [
                {
                    label: 'English',
                    i18nLang: 'en',
                    isRTL: false,
                },
                {
                    label: 'French',
                    i18nLang: 'fr',
                    isRTL: false,
                },
                {
                    label: 'Persian',
                    i18nLang: 'fa',
                    isRTL: true,
                },
            ],
        },
        theme: 'system',
        skin: Skins.Default,
        iconRenderer: VIcon,

        // isRTL: false,
    },
    navbar: {
        type: NavbarType.Sticky,
        navbarBlur: true,
    },
    footer: { type: FooterType.Static },
    verticalNav: {
        isVerticalNavCollapsed: false,
        defaultNavItemIconProps: { icon: 'tabler-circle' },
        isVerticalNavSemiDark: false,
    },
    horizontalNav: {
        type: 'sticky',
        transition: 'slide-y-reverse-transition',
        popoverOffset: 6,
    },

    /*
    // ℹ️  In below Icons section, you can specify icon for each component. Also you can use other props of v-icon component like `color` and `size` for each icon.
    // Such as: chevronDown: { icon: 'tabler-chevron-down', color:'primary', size: '24' },
    */
    icons: {
        chevronDown: { icon: 'tabler-chevron-down' },
        chevronRight: { icon: 'tabler-chevron-right', size: 20 },
        close: { icon: 'tabler-x' },
        verticalNavPinned: { icon: 'tabler-circle-dot' },
        verticalNavUnPinned: { icon: 'tabler-circle' },
        sectionTitlePlaceholder: { icon: 'tabler-minus' },
    },

})
