declare module 'console.table' {
    interface ConsoleTable {
        (data: any, columns?: string[]): void;
    }
    const table: ConsoleTable;
    export = table;
}