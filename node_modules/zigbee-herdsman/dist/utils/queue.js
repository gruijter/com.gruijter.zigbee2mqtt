"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    jobs;
    concurrent;
    constructor(concurrent = 1) {
        this.jobs = [];
        this.concurrent = concurrent;
    }
    async execute(func, key) {
        const job = { key, running: false };
        this.jobs.push(job);
        // Minor optimization/workaround: various tests like the idea that a job that is immediately runnable is run without an event loop spin.
        // This also helps with stack traces in some cases, so avoid an `await` if we can help it.
        if (this.getNext() !== job) {
            await new Promise((resolve) => {
                job.start = () => {
                    job.running = true;
                    resolve();
                };
                this.executeNext();
            });
        }
        else {
            job.running = true;
        }
        try {
            return await func();
        }
        finally {
            this.jobs.splice(this.jobs.indexOf(job), 1);
            this.executeNext();
        }
    }
    executeNext() {
        const job = this.getNext();
        if (job) {
            // if we get here, start is always defined for job
            // biome-ignore lint/style/noNonNullAssertion: ignored using `--suppress`
            job.start();
        }
    }
    getNext() {
        if (this.jobs.filter((j) => j.running).length > this.concurrent - 1) {
            return undefined;
        }
        for (let i = 0; i < this.jobs.length; i++) {
            const job = this.jobs[i];
            if (!job.running && (!job.key || !this.jobs.find((j) => j.key === job.key && j.running))) {
                return job;
            }
        }
        return undefined;
    }
    clear() {
        this.jobs = [];
    }
    count() {
        return this.jobs.length;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map