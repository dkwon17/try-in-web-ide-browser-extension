import { useEffect, useState } from "react";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Float/float.css";
import "./styles/App.css";

import {
    Button,
    Card,
    CardBody,
    Divider,
    Split,
    SplitItem,
    Form,
    FormGroup,
    TextInput,
    CardTitle,
} from "@patternfly/react-core";
import {
    Endpoint,
    getEndpoints,
    saveEndpoints,
} from "../preferences/preferences";
import { HostnamesList } from "./HostnamesList";

export const App = () => {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [newEndpointUrl, setNewEndpointUrl] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const endpoints = await getEndpoints();
            setEndpoints(endpoints);
        };
        fetchData().catch(console.error);
    }, []);

    const addNewEndpoint = async () => {
        const newEndpoints = endpoints.concat({
            url: newEndpointUrl,
            active: false,
            readonly: false,
        });
        await saveEndpoints(newEndpoints);
        await setEndpoints(newEndpoints);
        setNewEndpointUrl("");
    };

    const setDefault = async (endpoint: Endpoint) => {
        const newEndpoints = [...endpoints];
        newEndpoints.forEach((e) => {
            e.active = e == endpoint;
        });
        await saveEndpoints(newEndpoints);
        await setEndpoints(newEndpoints);
    };

    const deleteEndpoint = async (endpoint: Endpoint) => {
        const newEndpoints = endpoints.filter((e) => e != endpoint);
        await saveEndpoints(newEndpoints);
        await setEndpoints(newEndpoints);
    };

    const list = endpoints.length && (
        <HostnamesList
            endpoints={endpoints}
            onClickSetDefault={setDefault}
            onClickDelete={deleteEndpoint}
        />
    );

    return (
        <Card>
            <CardTitle>Dev Spaces hostnames</CardTitle>
            <CardBody>
                {list}
                <Divider className="pf-u-mt-md pf-u-mb-md" />
                <Split>
                    <SplitItem className="form-text-input">
                        <Form>
                            <FormGroup>
                                <TextInput
                                    type="text"
                                    aria-label="new hostname"
                                    value={newEndpointUrl}
                                    placeholder="Add hostname"
                                    onChange={setNewEndpointUrl}
                                />
                            </FormGroup>
                        </Form>
                    </SplitItem>
                    <SplitItem className="form-fill" isFilled></SplitItem>
                    <SplitItem>
                        <Button variant="primary" onClick={addNewEndpoint}>
                            Add
                        </Button>
                    </SplitItem>
                </Split>
            </CardBody>
        </Card>
    );
};
