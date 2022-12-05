import React from 'react';
import { Space, Select, Button } from 'antd';

class NavBar extends React.Component{

    render(){
        const { Option } = Select;
        return(
            <>
                
                <span className="logo" href="#">GeoExplainer</span>
                <Space
                    style={{ float: 'left', lineHeight: 0, marginTop: 8 }}
                >
                    <Select
                        value={this.props.select_case}
                        size="small"
                        onChange={this.props.handleCaseSelectionChange}
                        style={{
                            width: 140,
                            float: 'left',
                            
                        }}
                    >
                        <Option value="georgia">Georgia demo</Option>
                        <Option value="chicago">Chicago AirBnB</Option>
                    </Select>

                    <Button type="primary" size='small' onClick={this.props.handleLoadData}>Load Data</Button>
                    <Button type="primary" size='small' onClick={this.props.handleLoadCase}>Import Trained CSV</Button>
                </Space>

                <Button
                    size="small" 
                    type="default" 
                    style={{
                        float:'right',
                        //width: 70,
                        marginTop: 7,
                        marginRight: 5
                        
                    }}
                    //onClick={this.props.exportData}
                >
                    Load State
                </Button>

                <Button
                    size="small" 
                    type="default" 
                    style={{
                        float:'right',
                        //width: 70,
                        marginTop: 7,
                        marginRight: 10
                        
                    }}
                    //onClick={this.props.exportData}
                >
                    Save State
                </Button>

            </>
        );
    }
}

export default NavBar;