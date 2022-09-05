import {Component} from 'react';
import '../../styles/modelConfig.css';
//import { Card, Button, Select, Row, Col } from 'antd';
import ModelParameterSelection from './modelConfig';
import { VariableSelection } from './variableSelect';
import { DependentVar } from './dependentVar';
import { Correlation } from './correlation';
import { IndependentVars } from './independentVars';
//import { ConsoleSqlOutlined } from '@ant-design/icons';
 

class ModelConfigPanel extends Component {
    
    render() {
        const dependentContainerStyle = this.props.dependent_features.length > 0 ?
        {display: 'block'} : {display: 'none'};

        const correlationContainerStyle = this.props.currentActivCorrelation !== null ?
        {display: 'block'} : {display: 'none'};

        const independentContainerStyle = this.props.independent_features.length >= 2 ?
        {display: 'block'} : {display: 'none'};

        const configInterfaceStyle = this.props.model_trained ? {display: 'none'} : {display: 'block'};

        return(
            <div style={configInterfaceStyle}>
                <div className='floatConfigContainer'>
                {/** model parameter config panel */}
                    <ModelParameterSelection 
                        spatial_kernel={this.props.spatial_kernel}
                        model_type={this.props.model_type}
                        local_modal={this.props.local_modal}
        
                        handleModelKernel={this.props.handleModelKernel}
                        handleModelType={this.props.handleModelType}
                        handleLocalModel={this.props.handleLocalModel}

                        trainModel={this.props.trainModel}
                        exportData={this.props.exportData}
                    />

                {/** model variable selection panels */}
                    <VariableSelection
                        original_features={this.props.original_features}
                        dependent_features={this.props.dependent_features}
                        independent_features={this.props.independent_features}

                        sortable_components={this.props.sortable_components}

                        norm_test_result={this.props.norm_test_result}
                        
                        updateSortableList={this.props.updateSortableList}
                        currentActivCorrelation={this.props.currentActivCorrelation}
                    />
                </div>
                <div className='floatConfigVisComponentsContainer'>
                    <div className='configDependentYContainer' style={dependentContainerStyle}>
                        <DependentVar
                            dependent_features={this.props.dependent_features}
                            norm_test_result={this.props.norm_test_result}
                            logTransform={this.props.logTransform}
                            select_case={this.props.select_case}
                            logtrans_backup={this.props.logtrans_backup}
                        />
                    </div>

                    <div className='configCorrelationContainer' style={correlationContainerStyle}>
                        <Correlation
                            dependent_features={this.props.dependent_features}
                            currentActivCorrelation={this.props.currentActivCorrelation}
                            loaded_map_data={this.props.loaded_map_data}
                            select_case={this.props.select_case}
                            currentActivMapLayer={this.props.currentActivMapLayer}
                            setMapFilter={this.props.setMapFilter}
                        />
                    </div>

                    <div className='configIndependentXContainer' style={independentContainerStyle}>
                        <IndependentVars 
                            independent_features={this.props.independent_features}
                            loaded_map_data={this.props.loaded_map_data}
                            VIF_test_result={this.props.VIF_test_result}
                            select_case={this.props.select_case}
                        />
                    </div>
                </div>
            </div> 
        );
    }
}
export default ModelConfigPanel;
