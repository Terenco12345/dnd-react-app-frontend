import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class CharacterSheetGalleryPage extends React.Component {
    constructor(props) {
        super(props);
    }

    async handleTest(page) {
        console.log("Sending test request for resource...");
        await axios({
            method: 'get',
            url: process.env.SERVER_IP + '/character-sheet-gallery/test',
            withCredentials: true
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            if (err) {
                console.log("User is not authorized to access this resource, redirecting to home.");
                this.props.history.push("/"); // Should redirect to the home page.
            }
        })
    }

    render() {
        return (
            <div>
                
            </div>
        );
    }
}


export default withRouter(CharacterSheetGalleryPage);