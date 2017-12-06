// src/components/App.test.tsx
import * as React from 'react';
import { shallow, mount, render } from 'enzyme';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import * as fetch from 'jest-fetch-mock');
import App from './App.tsx';
import TagList from './TagList.tsx';
import * as jsdom from 'jsdom';
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

describe('App', function() {
  it('should render without throwing an error', function() {
    fetch.mockResponse(JSON.stringify([
        {
        "tagId":"Tag1",
        "label":"Power at Meter 1",
        "dataType":"double",
        "unit":"kW",
        "isTransient":false,
        "features":["power","meter","load","consumption"]
        },
        {
        "tagId":"Tag2",
        "label":"Unit 1 Online Status",
        "dataType":"boolean","unit":"Status",
        "isTransient":true,
        "features":["status","unit"]
        },
        {
        "tagId":"Tag3",
        "label":"Pump 1 Running",
        "dataType":"string",
        "unit":"Status",
        "isTransient":false,
        "features":["status","pump","consumption"]
        },
        {
        "tagId":"Tag4",
        "label":"Meter 1 Voltage",
        "dataType":"integer",
        "unit":"V",
        "isTransient":false,
        "features":["meter"]
        }
        ]));

        expect(shallow(<App />).find('.app').length).toBe(1);
  });

  it('should be selectable by class "app"', function() {
    expect(shallow(<App />).is('.app')).toBe(true);
  });

  it('should mount in a full DOM', function() {
    expect(mount(<App />).find('.app').length).toBe(1);
  });
});
