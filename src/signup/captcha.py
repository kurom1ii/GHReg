"""YesCaptcha FunCaptcha classification API client."""

import time
import requests

from .config import YESCAPTCHA_KEY, YESCAPTCHA_BASE, YESCAPTCHA_SOFT_ID


def solve_with_yescaptcha(image_b64_raw, question):
    """Call YesCaptcha FunCaptchaClassification API.
    image_b64_raw: raw base64 string WITHOUT data:image prefix.
    Returns (result_dict, task_id) or (None, None)."""
    payload = {
        "clientKey": YESCAPTCHA_KEY,
        "task": {
            "type": "FunCaptchaClassification",
            "image": image_b64_raw,
            "question": question,
        },
        "softID": YESCAPTCHA_SOFT_ID,
    }
    try:
        resp = requests.post(f"{YESCAPTCHA_BASE}/createTask", json=payload, timeout=30)
        data = resp.json()

        task_id = data.get("taskId")

        # Immediate result
        if data.get("errorId") == 0 and data.get("status") == "ready" and data.get("solution"):
            return _parse_solution(data["solution"]), task_id

        # Need polling
        if data.get("errorId") == 0 and task_id:
            result = _poll_task_result(task_id)
            return result, task_id

        print(f"    YesCaptcha error: {data.get('errorCode', '')} {data.get('errorDescription', '')}")
        return None, task_id
    except Exception as e:
        print(f"    YesCaptcha request failed: {e}")
        return None, None


def report_task(task_ids, is_success):
    """Report task result to YesCaptcha for model training.
    task_ids: list of task ID strings.
    is_success: True if solved correctly, False if wrong."""
    if not task_ids:
        return
    # Filter out None values
    valid_ids = [tid for tid in task_ids if tid]
    if not valid_ids:
        return
    try:
        resp = requests.post(f"{YESCAPTCHA_BASE}/report", json={
            "id": valid_ids,
            "isSuccess": is_success,
        }, timeout=10)
        data = resp.json()
        status = "OK" if data.get("errorId") == 0 else f"error: {data}"
        label = "success" if is_success else "failure"
        print(f"    Reported {len(valid_ids)} task(s) as {label}: {status}")
    except Exception as e:
        print(f"    Report failed: {e}")


def _poll_task_result(task_id, max_polls=20, interval=3):
    """Poll getTaskResult until ready."""
    for i in range(max_polls):
        time.sleep(interval)
        try:
            resp = requests.post(f"{YESCAPTCHA_BASE}/getTaskResult", json={
                "clientKey": YESCAPTCHA_KEY,
                "taskId": task_id,
            }, timeout=15)
            data = resp.json()
            if data.get("status") == "ready" and data.get("solution"):
                return _parse_solution(data["solution"])
            if data.get("errorId") != 0:
                print(f"    Poll error: {data.get('errorCode')}")
                return None
        except:
            pass
    print(f"    Polling timeout after {max_polls * interval}s")
    return None


def _parse_solution(solution):
    """Parse YesCaptcha solution into standardized result."""
    return {
        "objects": solution.get("objects", []),
        "labels": solution.get("labels", []),
        "confidences": solution.get("confidences", []),
        "label": solution.get("label", ""),
    }
