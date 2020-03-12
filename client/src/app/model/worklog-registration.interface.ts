export interface WorklogRegistration {
    task: Task;
}

interface Task {
    key: string;
    worklogs: Worklog[];
}

interface Worklog {
    oldId: number;
    timeSpentSeconds: number;
    comment: Comment;
}

interface Comment {
    type: string;
    version: number;
    content: Content[];
}

interface Content {
    type: string;
    content: TextContent[];
}

interface TextContent {
    text: string;
    type: string;
}
