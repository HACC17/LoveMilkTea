import { Command } from '@ionic/cli-utils/lib/command';
export declare class SSHBaseCommand extends Command {
    checkForOpenSSH(): Promise<1 | undefined>;
}
