import { CronJob,CronCommand } from "cron";
import { NO_JOB_FOUND, DUPLICATE_JOB } from "./message/job.messages";

export class JobRegistry {
    

    private readonly cronJobs = new Map<string , CronJob>()

    getCronJob(name : string) : CronJob {
        const ref = this.cronJobs.get(name)
        if(!ref){
            throw new Error(NO_JOB_FOUND("Cron Job",name))
        }
        return ref
    }

    getCronJobs (): Map<string, CronJob>{
      return this.cronJobs
    }

    addCronJob(name : string, cronTime : string | Date, onTick : CronCommand<null,boolean>): void {

        const cron = new CronJob(
          cronTime,
          onTick,
          null,
          null,
          "Asia/Bangkok"
        )

        const ref = this.cronJobs.get(name);
        if(ref){
            throw new Error(DUPLICATE_JOB("Cron Job",name));
        }

        cron.fireOnTick = this.wrapFunctionInTryCatchBlocks(cron.fireOnTick,cron)
        this.cronJobs.set(name,cron);
        cron.start()
    }

    runCronJob(name : string):void{
      const job = this.getCronJob(name)
      job.start()
    }

    stopCronJob(name : string) : string | undefined {
      const job = this.getCronJob(name)
      job.stop()
      
      return job.lastDate()?.toLocaleString("en-TH",{timeZone : "Asia/Bangkok"})

    }

    deleteCronJob(name : string) : void {
        const cronjob = this.getCronJob(name);
        cronjob.stop();
        this.cronJobs.delete(name);
    }
    

    private wrapFunctionInTryCatchBlocks(methodRef: Function, instance: object): (...args: unknown[]) => Promise<void> {
        return async (...args: unknown[]) => {
          try {
            await methodRef.call(instance, ...args);
          } catch (error) {
            throw new Error(JSON.stringify(error))
          }
        };
      }
}