import React, { Component } from 'react';
import '../../styles/modelConfig.css';
//import { Card, Button, Select, Row, Col } from 'antd';
import { DropCardContainer } from '../../utilities/dropCardContainer';
//import { SortableItem } from '../../utilities/sortableItem';

class VariableSelection extends Component {
    render(){
        
        return(
            <div className='variableSelectionContainer'>
                <DropCardContainer
                    title={'Dependent Variable Y'}
                    ifBottom={false}
                />
                <DropCardContainer
                    title={'Independent Variable X'}
                    ifBottom={false}
                    
                />
                <DropCardContainer
                    title={'Original Feature List'}
                    ifBottom={true}
                    sortableItems={this.props.originalSortableItems}
                />
            </div>
        );
    }
}
export default VariableSelection;

