from flask import Flask, request, jsonify
import re
import itertools
import sympy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def solver(var1, var2, var_hasil):
  equation = f"{var1} + {var2} = {var_hasil}"
  variables = set(re.findall(r'[A-Z]', equation))

  for perm in itertools.permutations(range(10), len(variables)):
    mapping = dict(zip(variables, perm))

    if mapping[var1[0]] == 0 or mapping[var2[0]] == 0 or mapping[var_hasil[0]] == 0:
      continue

    transformed_eq = equation
    for var, digit in mapping.items():
      transformed_eq = transformed_eq.replace(var, str(digit))

    lhs, rhs = transformed_eq.split("=")

    lhs_sym = sympy.sympify(lhs)
    rhs_sym = sympy.sympify(rhs)

    if lhs_sym == rhs_sym:
      return mapping

  return None

@app.route('/solve', methods=['POST'])
def solve_equation():
    data = request.get_json()
    var1 = data.get('var1')
    var2 = data.get('var2')
    var_hasil = data.get('var_hasil')

    if not all([var1, var2, var_hasil]):
        return jsonify({'error': 'Missing required fields: var1, var2, var_hasil'}), 400
    
    result = solver(var1, var2, var_hasil)

    if result:
        return jsonify({'solution': result})
    else:
        return jsonify({'error': 'No solution found'})

if __name__ == '__main__':
    app.run(debug=True)