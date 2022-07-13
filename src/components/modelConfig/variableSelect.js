import React, { Component } from 'react';
import '../../styles/modelConfig.css';
//import { Card, Button, Select, Row, Col } from 'antd';
import DropCardContainer from '../../utilities/dropCardContainer';

class VariableSelection extends Component {
    render(){

        return(
            <div className='variableSelectionContainer'>
                <DropCardContainer
                    title={'Dependent Variable Y'}
                />
            </div>
        );
    }
}
export default VariableSelection;

