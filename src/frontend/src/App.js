import './App.css';
import React, {useEffect, useState} from "react";
import {Table, Breadcrumb, Layout, Menu, Spin, Empty, Button, Badge, Tag, Radio, Popconfirm} from 'antd';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    PlusOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {deleteStudent, editStudent, getAllStudents} from "./client";
import StudentDrawerForm from "./StudentDrawerForm";
import TheAvatar from "./TheAvatar";
import {errorNotification, successNotification} from "./Nottification";

const {Header, Content, Footer, Sider} = Layout;
const items = [
    getItem('Option 1', '1', <PieChartOutlined/>),
    getItem('Option 2', '2', <DesktopOutlined/>),
    getItem('User', 'sub1', <UserOutlined/>, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined/>, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined/>),
];

const removeStudent = (studentId, fetchStudents) => {
    deleteStudent(studentId).then(() => {
        successNotification("Student deleted", `Student with id - ${studentId} was deleted`);
        fetchStudents();
    }).catch(err => {
        console.log(err.response);
        err.response.json().then(res => {
            console.log(res);
            errorNotification("There was an issue", `${res.message} [${res.status}] [${res.error}]`);
        });
    });
}

const changeStudent = (studentId, fetchStudents) => {
    editStudent(studentId).then(() => {
        successNotification("Student changed", `Student with id - ${studentId} was changed`);
        fetchStudents();
    });
}

const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name}/>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement="topLeft"
                    title={`Are you sure to delete ${student.name}?`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Radio.Button value="large">Delete</Radio.Button>
                </Popconfirm>
                <Popconfirm
                    placement="topLeft"
                    title={`Are you sure to change data for ${student.name}?`}
                    onConfirm={() => changeStudent(student.id, fetchStudents)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Radio.Button value="small">Edit</Radio.Button>
                </Popconfirm>


            </Radio.Group>
    }
];

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}


function App() {
    const [collapsed, setCollapsed] = useState(false);
    const [students, setStudents] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);


    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                setStudents(data);

            })
            .catch(err => {
                console.log(err.response);
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification("There was an issue", `${res.message} [${res.status}] [${res.error}]`);
                });
            })
            .finally(() => {
                setFetching(false)
            });

    useEffect(() => {
        console.log("comp moumt");
        fetchStudents();
    }, [])


    const renderStudents = () => {
        if (fetching) {
            return <Spin size="large"/>
        }
        if (students.length <= 0) {
            return <Empty/>;
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />

            <Table
                rowKey={(student) => student.id}
                dataSource={students}
                columns={columns(fetchStudents)}
                bordered title={() =>
                <>
                    <Button

                        onClick={() => setShowDrawer(!showDrawer)}
                        type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                        Add new Student
                    </Button>
                    <div style={{marginLeft: "10px", float: "right"}}>
                        <Tag style={{marginLeft: "10px"}}>Number of students</Tag>
                        <Badge
                            className="site-badge-count-109"
                            count={students.length}
                        />
                    </div>
                </>
            }
                pagination={{pageSize: 50}}
                scroll={{y: 560}}
            />
        </>
    }

    return <Layout
        style={{
            minHeight: '100vh',
        }}
    >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items}/>
        </Sider>
        <Layout className="site-layout">
            <Header
                className="site-layout-background"
                style={{
                    padding: 0,
                }}
            />
            <Content
                style={{
                    margin: '0 16px',
                }}
            >
                <Breadcrumb
                    style={{
                        margin: '16px 0',
                    }}
                >
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        minHeight: 360,
                    }}
                >
                    {renderStudents()}
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >By Makar0ha
            </Footer>
        </Layout>
    </Layout>
}

export default App;
