import React, { Component } from 'react';
import '../../styles/modelConfig.css';
import { Card, Button, Select, Row, Col } from 'antd';

class ModelParameterSelection extends Component {
    render(){
        const { Option } = Select;
        return(
            <Card
                title='Model Configuration'
                size='small'
                className='configCard'
                //style={{height: 298}}
                extra={
                    <div
                        style={{
                            display: 'inline-block',
                            height: 30,
                            fontSize: 10
                        }}
                    >

                        <Button
                        size="small" 
                        type="primary" 
                        style={{
                            float:'left',
                            //width: 70,
                            marginTop: 5,
                            marginRight: 5
                            
                        }}
                        onClick={this.props.trainModel}
                        >
                            Train Model
                        </Button>
                    </div>
                }
            >
                <div className='space-align-container-config'>
                    <div className='space-align-block-config' style={{width: '7vw'}}>
                        <span style={{fontSize: 13}}>Spatial kernel</span>
                        <Select
                            value={this.props.spatial_kernel}
                            size="small"
                            onChange={this.props.handleModelKernel}
                            style={{
                                //width: 135,
                                float: 'left',
                                fontSize: 12,
                                //marginRight: '5px'
                            }}
                        >   
                            <Option value="adaptive bisquare" style={{fontSize: 12}}>adaptive bisquare</Option>
                            <Option value="fixed gaussian" style={{fontSize: 12}}>fixed gaussian</Option>
                        </Select>
                    </div>

                    <div className='space-align-block-config' style={{width: '6.5vw'}}>
                        <span style={{fontSize: 13}}>Model type</span>
                        <Select
                            value={this.props.model_type}
                            size="small"
                            onChange={this.props.handleModelType}
                            style={{
                                width: 135,
                                
                                fontSize: 12
                                
                            }}
                        >   
                            <Option value="gaussian" style={{fontSize: 12}}>Gaussian</Option>
                            <Option value="binomal" style={{fontSize: 12}}>Binomal</Option>
                            <Option value="poisson" style={{fontSize: 12}}>Poisson</Option>
                        </Select>
                    </div>

                    <div className='space-align-block-config end' style={{width: '6vw'}}>
                        <span style={{fontSize: 13}}>Local Model</span>
                        <Select
                            value={this.props.local_modal}
                            size="small"
                            onChange={this.props.handleLocalModel}
                            style={{
                                width: 100,
                                
                                fontSize: 12,
                                //marginRight: '5px'
                            }}
                        >   
                            <Option value="gwr" style={{fontSize: 12}}>GWR</Option>
                            <Option value="mgwr" style={{fontSize: 12}}>MGWR</Option>
                        </Select>
                    </div>
                </div>

            </Card>
        );
    }
}
export default ModelParameterSelection;