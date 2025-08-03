"""
Code tools for AI agents
코드 실행, 분석, 생성 도구들
"""

import subprocess
import tempfile
import os
import ast
from typing import Dict, List, Optional
from langchain.tools import Tool


def execute_python_code(code: str) -> Dict[str, str]:
    """
    Python 코드를 안전하게 실행합니다.
    
    Args:
        code: 실행할 Python 코드
        
    Returns:
        Dict with 'output' and 'error' keys
    """
    try:
        # 임시 파일에 코드 저장
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        # 코드 실행
        result = subprocess.run(
            ['python', temp_file],
            capture_output=True,
            text=True,
            timeout=30  # 30초 타임아웃
        )
        
        # 임시 파일 삭제
        os.unlink(temp_file)
        
        return {
            'output': result.stdout,
            'error': result.stderr,
            'success': result.returncode == 0
        }
        
    except Exception as e:
        return {
            'output': '',
            'error': str(e),
            'success': False
        }


def validate_python_syntax(code: str) -> Dict[str, any]:
    """
    Python 코드 문법을 검증합니다.
    
    Args:
        code: 검증할 Python 코드
        
    Returns:
        Dict with validation results
    """
    try:
        ast.parse(code)
        return {
            'valid': True,
            'error': None,
            'message': '코드 문법이 올바릅니다.'
        }
    except SyntaxError as e:
        return {
            'valid': False,
            'error': str(e),
            'message': f'문법 오류: {e}'
        }
    except Exception as e:
        return {
            'valid': False,
            'error': str(e),
            'message': f'검증 중 오류 발생: {e}'
        }


def analyze_code_complexity(code: str) -> Dict[str, any]:
    """
    Python 코드의 복잡도를 분석합니다.
    
    Args:
        code: 분석할 Python 코드
        
    Returns:
        Dict with complexity metrics
    """
    try:
        tree = ast.parse(code)
        
        # 기본 메트릭 계산
        lines = len(code.split('\n'))
        functions = len([node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)])
        classes = len([node for node in ast.walk(tree) if isinstance(node, ast.ClassDef)])
        imports = len([node for node in ast.walk(tree) if isinstance(node, ast.Import)])
        imports_from = len([node for node in ast.walk(tree) if isinstance(node, ast.ImportFrom)])
        
        # 순환 복잡도 계산 (간단한 버전)
        complexity = 1  # 기본값
        for node in ast.walk(tree):
            if isinstance(node, (ast.If, ast.While, ast.For, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(node, ast.BoolOp):
                complexity += len(node.values) - 1
        
        return {
            'lines': lines,
            'functions': functions,
            'classes': classes,
            'imports': imports + imports_from,
            'complexity': complexity,
            'message': f'코드 분석 완료: {lines}줄, {functions}개 함수, 복잡도 {complexity}'
        }
        
    except Exception as e:
        return {
            'error': str(e),
            'message': f'분석 중 오류 발생: {e}'
        }


def generate_test_code(code: str) -> str:
    """
    주어진 코드에 대한 테스트 코드를 생성합니다.
    
    Args:
        code: 테스트할 Python 코드
        
    Returns:
        Generated test code
    """
    try:
        tree = ast.parse(code)
        functions = [node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
        
        test_code = "import pytest\n\n"
        
        for func in functions:
            test_code += f"def test_{func.name}():\n"
            test_code += f"    # TODO: {func.name} 함수에 대한 테스트 작성\n"
            test_code += f"    pass\n\n"
        
        return test_code
        
    except Exception as e:
        return f"# 테스트 코드 생성 중 오류: {e}"


def get_code_tools() -> List[Tool]:
    """
    코드 관련 LangChain 도구들을 반환합니다.
    """
    return [
        Tool.from_function(
            name="execute_python_code",
            func=execute_python_code,
            description="Python 코드를 안전하게 실행합니다. 코드를 문자열로 받아 실행 결과를 반환합니다."
        ),
        Tool.from_function(
            name="validate_python_syntax",
            func=validate_python_syntax,
            description="Python 코드의 문법을 검증합니다. 문법 오류가 있으면 오류 메시지를 반환합니다."
        ),
        Tool.from_function(
            name="analyze_code_complexity",
            func=analyze_code_complexity,
            description="Python 코드의 복잡도를 분석합니다. 라인 수, 함수 수, 순환 복잡도 등을 계산합니다."
        ),
        Tool.from_function(
            name="generate_test_code",
            func=generate_test_code,
            description="주어진 Python 코드에 대한 기본 테스트 코드를 생성합니다."
        )
    ] 