import { GitServiceFactory } from '../gitServices/GitServiceFactory';

/* Unconditionally add the CSS rules to the first stylesheet which is
 * available in the page. */
document.styleSheets[0].insertRule('.travis-ci{display:inline-block;margin-left:8px;line-height:1em;position:relative;top:3px;opacity:.85;}', 1);
document.styleSheets[0].insertRule('.travis-ci:hover{opacity:1}', 1);
document.styleSheets[0].insertRule('.travis-ci img{display:block;}', 1);

GitServiceFactory.getGitService().injectButton();
