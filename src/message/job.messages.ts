export const NO_JOB_FOUND = (jobName : string ,name ?: string)=>
name 
    ?`No ${jobName} was found with the given name (${name}). Check that you created one with a decorator or with the create API.`
    : `No ${jobName} was found. Check your configuration.`;

export const DUPLICATE_JOB = (jobName : string ,name ?: string) => 
    `${jobName} with the given name (${name}) already exists. Ignored.`