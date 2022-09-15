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
                    <Button type="primary" size='small'>Import Trained CSV</Button>

                </Space>
            </>
        );
    }
}

export default NavBar;