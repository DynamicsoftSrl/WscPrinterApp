import { ActivityModel } from './activity-model';
import { OrderDetailsWorkflow } from './order-details-workflow-model';

export class ActivitiesViewModel {
    public CountActivities: number;
    public Activities: ActivityModel[];
    public OrderDetailsWorkflow: OrderDetailsWorkflow;
    
    constructor() {
        this.Activities = [];
        this.OrderDetailsWorkflow = new OrderDetailsWorkflow();
    }
}