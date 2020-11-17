import ENV from 'cheevies/config/environment';

const { rootURL } = ENV;

export default function getRootUrl() {
    return rootURL;
}