import React, { Component } from 'react';
import '../../styles/modelConfig.css';
//import { Card, Button, Select, Row, Col } from 'antd';
import { DropCardContainer } from '../../utilities/dropCardContainer';
import { SortableItem } from '../../utilities/sortableItem';

class VariableSelection extends Component {
    render(){
        const sortableItems = [];
        const testContent = [1,2,3,4,5,6,7];
        testContent.forEach((e,i) => sortableItems.push(<SortableItem key={i} content={e} />));
        console.log(sortableItems);

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
                    sortableItems={sortableItems}
                />
            </div>
        );
    }
}
export default VariableSelection;

