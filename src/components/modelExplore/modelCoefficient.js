import React, {useEffect, useState} from "react";
import '../../styles/modelExplor.css';
import { Card, Descriptions, Table, Button } from 'antd';
import { BarChartOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Boxplot } from "../../utilities/boxplot";

export function ModelCoefficient (props) {
    const [coeffData, setcoeffData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    return (
        <Card
            className="explorationCard"
            title="Local coefficients"
            size="small"
            style={{marginTop: 8}}
            bodyStyle={{
                padding: 0,
                height: 100
            }}
        >

        </Card>
    );
}
