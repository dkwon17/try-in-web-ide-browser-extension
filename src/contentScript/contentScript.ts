import { ButtonInjectorFactory } from '../buttonInjectors/ButtonInjectorFactory';

try {
    ButtonInjectorFactory.getButtonInjector()?.injectButton();
} catch(e) {
    const message = e instanceof Error ? e.message : e;
    console.log(`try-in-web-ide-browser-extension error: ${message}`);
}
