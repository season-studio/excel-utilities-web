import * as React from "react";
import * as ReactDOM from "react-dom";

export class AboutPage extends React.Component {
    constructor(_props) {
        super(_props);
    }

    render() {
        return <div style={{padding:"1em"}}>
            <h3 style={{textAlign:"center"}}>电子表格数据计算辅助工具（独立网页版）</h3>
            <p>
                这是一个用来提供电子表格定制化数据计算的工具。<br />
                工具内部预置了少量的已定制的数据计算功能。同时，工具支持用户采用无代码的方式自行编排新增的数据计算功能。<br />
                该工具可以保存成一个独立的页面，在单机上用浏览器直接打开使用。<br />
            </p>
            <h5>我开发这个工具的原因有几点：</h5>
            <ul>
                <li>我妻子所在公司的工作岗位需要处理大量的电子表格数据，但她们公司没有为员工提供足够的IT技术支撑，导致她的工作量很大。</li>
                <li>我妻子所在的公司实行严格又机械化的IT管理，我用VSTO写的Excel插件无法安装在她的办公电脑上；用Office Add-ins编写的插件又因为她们公司办公电脑无法访问外网而不能使用；唯一一个简单的可以自行运行程序的方法就是使用浏览器运行本地页面中的JS脚本。</li>
                <li>我妻子不是程序员，不擅于自行使用VBA或其他语言编写数据计算方法。</li>
            </ul>
            <p style={{textAlign:"center"}}><button onClick={() => this.props.globalApp?.switchStage("")}>返回主页</button></p>
        </div>
    }
}