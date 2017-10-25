import Model from './model';
import CheckBox from 'kenga-buttons/check-box';
import Flow from 'kenga-containers/flow-pane';

const model = new Model();
model.pallete.add(
        {
            widget: CheckBox,
            from: 'kenga-buttons/check-box',
            name: 'Check box',
            description: 'Check box with button group capability',
            //iconStyle: 'kenga-check-box-icon',
            category: 'Standard'
        },
        {
            widget: Flow,
            from: 'kenga-containers/flow-pane',
            name: 'Flow container',
            description: 'Flow container with rows wraps',
            //iconStyle: 'kenga-flow-icon',
            category: 'Containers'
        }
);