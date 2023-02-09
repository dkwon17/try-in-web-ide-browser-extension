import { GitHubButtonInjector } from "./github/GitHubButtonInjector";
import { ButtonInjector } from "./ButtonInjector";

export class ButtonInjectorFactory {
    static getButtonInjector(): ButtonInjector | undefined {
        if (GitHubButtonInjector.matches()) {
            return new GitHubButtonInjector();
        }
        return undefined;
    }
}
