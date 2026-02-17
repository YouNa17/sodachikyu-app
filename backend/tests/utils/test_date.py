from app.utils.date import get_jst_today
from datetime import date


def test_get_jst_today():

    result = get_jst_today()

    assert isinstance(result, date)
