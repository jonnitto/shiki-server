import {
    bundledLanguages,
    bundledThemes,
    codeToHtml,
    createHighlighter
  } from 'shiki/bundle/full'
import { FusionSyntax } from './FusionSyntax.js';

const FusionLanguage = {
    embeddedLangs: ["html-derivative"],
    ...FusionSyntax,
};

export const languageKeys = [...Object.keys(bundledLanguages), 'neosfusion'];
export const themeKeys = Object.keys(bundledThemes);

let highlighter = null;
let calledHighlighter = false;

async function getHighlighter() {
    if (highlighter) {
        return highlighter;
    }
    if (calledHighlighter) {
        await wait(100);
        return await getHighlighter();
    }
    calledHighlighter = true;
    highlighter = await createHighlighter({
        langs: [],
        themes: themeKeys
    });
    return highlighter;
}


export async function highlight({code, lang, theme, themeDark}) {
    code = code.trim();
    await getHighlighter();

    if (lang === "neosfusion") {
        lang = FusionLanguage;
        await highlighter.loadLanguage("html-derivative");
    }
    await highlighter.loadLanguage(lang);

    let options = { lang };

    if (themeDark) {
        options.themes = {
            light: theme,
            dark: themeDark
        };
    } else {
        options.theme = theme;
    }

    const html = await highlighter.codeToHtml(code, options);
    const colors = {
        default: getColors(theme),
        dark: getColors(themeDark),
    }

    return { html, colors, code };
}

function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function getColors(theme) {
    if (!theme) {
        return null;
    }
    const colors = highlighter.getTheme(theme);
    return {
        fg: colors.fg,
        bg: colors.bg,
    }
}
