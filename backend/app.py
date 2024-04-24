from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/packageInfo', methods=['GET'])
def get_package_info():
    print(request)
    package_name = request.args.get('packageName')

    # Log the package name to the console
    print('Received package name:', package_name)

    if not package_name:
        return jsonify({'error': 'Package name is required'}), 400

    try:
        response = requests.get(f'https://pypi.org/pypi/{package_name}/json')
        response.raise_for_status()
        package_info = response.json()
        response2 = requests.get(f'http://pypistats.org/api/packages/{package_name}/recent')
        response2.raise_for_status()
        package_info2 = response2.json()
        combined_dict = dict(package_info)
        combined_dict.update(package_info2)
        return jsonify(combined_dict), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
