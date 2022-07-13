import {Component} from 'react';
import '../../styles/modelConfig.css';
//import { Card, Button, Select, Row, Col } from 'antd';
import ModelParameterSelection from './modelConfig';
import VariableSelection from './variableSelect';
 
class ModelConfigPanel extends Component {

    render(){

        return(
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
            <VariableSelection />
                
            </div>
        );
    }
}
export default ModelConfigPanel;
