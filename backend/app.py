from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/packageInfoPython', methods=['GET'])
def get_package_info_python():
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

@app.route('/api/packageInfoRuby', methods=['GET'])
def get_package_info_ruby():
    print(request)
    package_name = request.args.get('packageName')

    # Log the package name to the console
    print('Received package name:', package_name)

    if not package_name:
        return jsonify({'error': 'Package name is required'}), 400

    try:
        response = requests.get(f'https://rubygems.org/api/v1/gems/{package_name}.json')
        print(response)
        response.raise_for_status()
        package_info = response.json()
        return jsonify(package_info), 200
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/packageInfoNode', methods=['GET'])
def get_package_info_node():
    print(request)
    package_name = request.args.get('packageName')

    # Log the package name to the console
    print('Received package name:', package_name)

    if not package_name:
        return jsonify({'error': 'Package name is required'}), 400

    try:
        response = requests.get(f'https://registry.npmjs.org/{package_name}/latest')
        response.raise_for_status()
        package_info = response.json()
        response2 = requests.get(f'https://api.npmjs.org/downloads/point/last-month/{package_name}')
        response2.raise_for_status()
        print(response2)
        package_info2 = response2.json()
        combined_dict = dict(package_info)
        combined_dict.update(package_info2)
        return jsonify(combined_dict), 200

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/packageInfoRust', methods=['GET'])
def get_package_info_rust():
    print(request)
    package_name = request.args.get('packageName')

    # Log the package name to the console
    print('Received package name:', package_name)

    if not package_name:
        return jsonify({'error': 'Package name is required'}), 400

    try:
        response = requests.get(f'https://crates.io/api/v1/crates/{package_name}/versions')
        response.raise_for_status()
        package_info = response.json()
        response2 = requests.get(f'https://crates.io/api/v1/crates/{package_name}')
        response2.raise_for_status()
        package_info2 = response2.json()
        combined_dict = dict(package_info)
        combined_dict.update(package_info2)
        return jsonify(combined_dict), 200

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500





if __name__ == '__main__':
    app.run(debug=True)
