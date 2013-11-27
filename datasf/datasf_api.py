import json
import oauth2
import optparse
import urllib
import urllib2

def search(host, dataset_identifier, search_params):
    """Returns response for API request."""
    # Unsigned URL
    encoded_params = ''
    if search_params:
        encoded_params = urllib.urlencode(search_params)
    url = 'http://%s%s?%s' % (host, dataset_identifier, encoded_params)
    print 'URL: %s' % (url,)

    # Connect
    try:
        conn = urllib2.urlopen(url, None)
        try:
            response = json.loads(conn.read())
        finally:
            conn.close()
    except urllib2.HTTPError, error:
        response = json.loads(error.read())

    return response