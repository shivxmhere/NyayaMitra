import pytest
from app.services.case_summarizer import check_bail_eligibility

@pytest.mark.asyncio
async def test_pure_bailable():
    # IPC 420, 468 are bailable
    assert await check_bail_eligibility("IPC 420, 468") == "eligible"

@pytest.mark.asyncio
async def test_pure_non_bailable():
    # IPC 302, 376 are non-bailable
    assert await check_bail_eligibility("IPC 302, 376") == "not_eligible"

@pytest.mark.asyncio
async def test_mixed_sections():
    # One non-bailable (302) makes it not eligible
    assert await check_bail_eligibility("IPC 420, 302, 468") == "not_eligible"

@pytest.mark.asyncio
async def test_empty_string():
    assert await check_bail_eligibility("") == "unknown"
    assert await check_bail_eligibility("   ") == "unknown"

@pytest.mark.asyncio
async def test_graceful_handling():
    # Handles extra spaces and lowercase
    assert await check_bail_eligibility("  ipc 302  ") == "not_eligible"
    assert await check_bail_eligibility("ipc 420") == "eligible"
