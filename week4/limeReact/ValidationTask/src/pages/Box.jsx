
import Button from '../components/ui/Button';
import React, { useState } from 'react';

export function Box(props) {
 
    return (    
        <div className="row">
            <div className="col-6">
                <div className="d-flex align-items-center">
                    <div className="ms-3">
                        <Button loading={props.isLoading} onClick={props.onClick} type="primary">
                            {props.title}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}