import { GitHubService } from "./GitHubService";
import { GitService } from "./GitService";

export class GitServiceFactory {
    static getGitService(): GitService {
        if (GitHubService.matches()) {
            return new GitHubService();
        }
    }
}
