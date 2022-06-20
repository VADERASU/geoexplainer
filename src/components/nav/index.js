import React from 'react';
import { Space, Select } from 'antd';

class NavBar extends React.Component{

    render(){
        const { Option } = Select;
        return(
            <>
                
                 <span className="logo" href="#">GeoExplainer</span>
                <Space
                    style={{ float: 'left' }}
                >
                    <Select
                        defaultValue="georgia"
                        size="small"
                        style={{
                            width: 140,
                            float: 'left',
                            marginTop: 8
                        }}
                    >
                        <Option value="georgia">Georgia demo</Option>
                        <Option value="chicago">Chicago AirBnB</Option>
                    </Select>


                </Space>
            </>
        );
    }
}

export default NavBar;