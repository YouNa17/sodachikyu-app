from app.utils.date import get_jst_today
from datetime import date, datetime, timedelta, timezone


# UT-01
def test_get_jst_today():

    result = get_jst_today()

    assert isinstance(result, date)


# UT-02
def test_get_jst_today_is_jst():
    result = get_jst_today()

    jst = timezone(timedelta(hours=9))
    expected = datetime.now(jst).date()

    assert result == expected
