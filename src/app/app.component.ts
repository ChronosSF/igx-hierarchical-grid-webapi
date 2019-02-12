import { Component, ViewChild } from '@angular/core';
import { RemoteService } from '../services/remote.service';
import {
    IgxHierarchicalGridComponent,
    IgxRowIslandComponent,
    IGridCreatedEventArgs,
    Transaction,
    TransactionType,
    IgxHierarchicalTransactionServiceFactory,
    IgxHierarchicalGridBaseComponent,
    IgxDialogComponent
} from 'igniteui-angular'; 


export class Employee {
    public id: number;
    public name: string;
    public age: number;
}

export class Vacation {
    public id: number;
    public employeeId: number;
    public from: Date;
    public to: Date;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ IgxHierarchicalTransactionServiceFactory ]
})
export class AppComponent {

    public ownGrid: IgxHierarchicalGridComponent;

    public remoteData = [];
    public childData = [];

    public newEmployee = new Employee();
    public newVacation = new Vacation();

    public dialogContext;

    private semaphore = 0;

    @ViewChild('rowIsland1')
    rowIsland1: IgxRowIslandComponent;

    @ViewChild('hGrid')
    hGrid: IgxHierarchicalGridComponent;

    @ViewChild("dialogEmployee", { read: IgxDialogComponent })
    public dialogEmployee: IgxDialogComponent;

    @ViewChild("dialogVacation", { read: IgxDialogComponent })
    public dialogVacation: IgxDialogComponent;

    constructor(private remoteService: RemoteService) {
        remoteService.url = 'api/';
        this.remoteService.urlBuilder = (dataState, transactions) => this.buildUrl(dataState, transactions);
    }

    public buildUrl(dataState, transactions?: Transaction[]) {
        let qS = '';
        if (dataState) {
            qS += `${dataState.key}?`;

            const level = dataState.level;
            if (transactions) {
                transactions.forEach(t => qS += 'id=' + t.id + "&");
            } else if (level === 1) { 
                qS += 'employeeid=' + dataState.parentID;
            }
        }
        return `${this.remoteService.url}${qS}`;
    }

    public ngAfterViewInit() {
        this.remoteService.getData({ parentID: null, level: 0, key: 'employees' }, (data) => {
            this.remoteData = data;
        });
    }

    gridCreated(event: IGridCreatedEventArgs, rowIsland: IgxRowIslandComponent) {
        this.remoteService.getData({ parentID: event.parentID, level: rowIsland.level, key: rowIsland.key }, (data) => {
            for (let rec of data) {
                rec.from = new Date(rec.from);
                rec.to = new Date(rec.to);
            }
            this.childData = data;
            event.grid.data = data;
            event.grid.cdr.detectChanges();
        });
        this.ownGrid = event.grid;
    }

    openVacationDialog(grid) {
        this.dialogContext = grid;
        this.dialogVacation.open();
    }

    addEmployee() {
        this.hGrid.addRow(this.newEmployee);
        this.cancel();
    }

    addVacation() {
        this.newVacation.employeeId =  this.dialogContext.foreignKey;
        this.dialogContext.addRow(this.newVacation);
        this.cancel();
    }

    cancel() {
        this.dialogEmployee.close();
        this.dialogVacation.close();
        this.newEmployee = new Employee();
        this.newVacation = new Vacation();
    }

    removeRow(rowId: number, owner: IgxHierarchicalGridComponent) {
        owner.deleteRow(rowId);
    }

    commitAllTransactions() {
        this.commitForState({ parentID: null, level: 0, key: 'employees' }, this.hGrid);
        
        this.commitForState({ parentID: null, level: 1, key: 'vacations' }, this.rowIsland1);
        this.rowIsland1.hgridAPI.getChildGrids().forEach((grid) => {
            grid.transactions.commit(grid.data);
            grid.cdr.detectChanges();
        });
    }

    commitForState(state, grid: IgxHierarchicalGridBaseComponent) {
        const transactions: Transaction[] = grid.transactions.getAggregatedChanges(true);
        const addTransactions = transactions.filter(t => t.type === TransactionType.ADD);
        const deleteTransactions = transactions.filter(t => t.type === TransactionType.DELETE);
        const updateTransactions = transactions.filter(t => t.type === TransactionType.UPDATE);

        if (addTransactions.length) {
            addTransactions.forEach(t => {
                this.semaphore--;
                this.remoteService.create(state, t).subscribe(d => this.createHandler(d, t, grid));
            })
        }
        if (deleteTransactions.length) {
            this.semaphore--;
            this.remoteService.remove(state, deleteTransactions).subscribe(d => this.responseHandler(d, grid));
        }
        if (updateTransactions.length) {
            this.semaphore--;
            this.remoteService.update(state, updateTransactions).subscribe(d => this.responseHandler(d, grid));
        }
    }

    createHandler(d, t: Transaction, grid) {
        console.log(d);
        if (d.id) {
            t.newValue.id = d.id;
        }
        this.semaphore++;
        if (!this.semaphore) {
            grid.transactions.commit((grid as IgxHierarchicalGridComponent).data);
            grid._pipeTrigger++;
        }
    }

    responseHandler = (d, grid) => {
        console.log(d);
        this.semaphore++;
        if (!this.semaphore) {
            grid.transactions.commit((grid as IgxHierarchicalGridComponent).data);
        }
    }
}

