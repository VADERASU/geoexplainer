import {Component} from 'react';
import '../../styles/modelConfig.css';
//import { Card, Button, Select, Row, Col } from 'antd';
import ModelParameterSelection from './modelConfig';
import { VariableSelection } from './variableSelect';
import { DependentVar } from './dependentVar';
import { Correlation } from './correlation';
import { ConsoleSqlOutlined } from '@ant-design/icons';
 
class ModelConfigPanel extends Component {
    
    render(){

        var corrX = [];
        var corrY = [];
        if (this.props.loaded_map_data && this.props.currentActivCorrelation) {
            corrX = this.props.loaded_map_data.features.map(d => d.properties[this.props.currentActivCorrelation]);
            corrY = this.props.loaded_map_data.features.map(d => d.properties[this.props.dependent_features[0]]);
        }

        const dependentContainerStyle = this.props.dependent_features.length > 0 ?
        {display: 'block'} : {display: 'none'};

        const correlationContainerStyle = this.props.currentActivCorrelation !== null ?
        {display: 'block'} : {display: 'none'};

        return(
            <>
                <div className='floatConfigContainer'>
                {/** model parameter config panel */}
                    <ModelParameterSelection 
                        spatial_kernel={this.props.spatial_kernel}
                        model_type={this.props.model_type}
                        local_modal={this.props.local_modal}
        
                        handleModelKernel={this.props.handleModelKernel}
                        handleModelType={this.props.handleModelType}
                        handleLocalModel={this.props.handleLocalModel}
                    />

                {/** model variable selection panels */}
                    <VariableSelection
                        original_features={this.props.original_features}
                        dependent_features={this.props.dependent_features}
                        independent_features={this.props.independent_features}

                        sortable_components={this.props.sortable_components}

                        norm_test_result={this.props.norm_test_result}
                        
                        updateSortableList={this.props.updateSortableList}
                    />
                </div>

                <div className='configDependentYContainer' style={dependentContainerStyle}>
                    <DependentVar
                        dependent_features={this.props.dependent_features}
                        norm_test_result={this.props.norm_test_result}
                    />
                </div>
                <div className='configCorrelationContainer' style={correlationContainerStyle}>
                    <Correlation
                        dependent_features={this.props.dependent_features}
                        currentActivCorrelation={this.props.currentActivCorrelation}
                        corrX={corrX}
                        corrY={corrY}
                    />
                </div>
            </>
            
        );
    }
}
export default ModelConfigPanel;
