import React, { Component } from 'react';

export default class DetailHost extends Component {

    componentDidMount(){
        console.log(this.props.match.params.id);
    }

    render() {
        return (
            <div>
                aaa
            </div>
        )
    }
}
