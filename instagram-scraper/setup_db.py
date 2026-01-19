"""
Database Setup Script
SMAN 1 Baleendah - Instagram Scraper

This script:
1. Creates scraper tables (sc_bot_accounts, sc_raw_news_feeds)
2. Seeds initial placeholder bot account for easy manual configuration
"""

from models import Base, BotAccount, RawNewsFeed, create_db_engine, get_session
from sqlalchemy import inspect
from datetime import datetime


def setup_database():
    """
    Initialize database tables and seed initial data
    """
    print("╔══════════════════════════════════════════════════════════════════════════════╗")
    print("║          Instagram Scraper Database Setup - SMAN 1 Baleendah                ║")
    print("╚══════════════════════════════════════════════════════════════════════════════╝\n")
    
    try:
        # Step 1: Create engine and connect
        print("📡 Connecting to PostgreSQL database...")
        engine = create_db_engine()
        
        # Test connection
        with engine.connect() as conn:
            print("✅ Database connection successful!\n")
        
        # Step 2: Create tables
        print("📦 Creating scraper tables...")
        Base.metadata.create_all(engine)
        
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        if 'sc_bot_accounts' in existing_tables:
            print("   ✓ Table 'sc_bot_accounts' created/verified")
        if 'sc_raw_news_feeds' in existing_tables:
            print("   ✓ Table 'sc_raw_news_feeds' created/verified")
        
        print()
        
        # Step 3: Seed initial bot account if empty
        print("👤 Checking bot accounts...")
        session = get_session()
        
        bot_count = session.query(BotAccount).count()
        
        if bot_count == 0:
            print("   ⚠️  No bot accounts found. Creating placeholder account...")
            
            placeholder = BotAccount(
                username='CHANGE_ME',
                password='CHANGE_ME',
                is_active=False,  # Disabled by default until configured
                notes='Placeholder account. Please update via SQL editor or Python script.'
            )
            
            session.add(placeholder)
            session.commit()
            
            print("   ✅ Placeholder account created:")
            print("      Username: CHANGE_ME")
            print("      Password: CHANGE_ME")
            print("      Status: INACTIVE (update credentials to activate)\n")
            print("   ⚡ Quick Update SQL:")
            print("      UPDATE sc_bot_accounts")
            print("      SET username='your_ig_username', password='your_ig_password', is_active=true")
            print("      WHERE username='CHANGE_ME';\n")
        else:
            print(f"   ✓ Found {bot_count} existing bot account(s)")
            accounts = session.query(BotAccount).all()
            for acc in accounts:
                status = "ACTIVE" if acc.is_active else "INACTIVE"
                print(f"      - {acc.username} [{status}]")
            print()
        
        session.close()
        
        # Step 4: Check raw news feeds
        session = get_session()
        feed_count = session.query(RawNewsFeed).count()
        pending_count = session.query(RawNewsFeed).filter_by(is_processed=False).count()
        
        print("📰 News feeds status:")
        print(f"   Total scraped: {feed_count}")
        print(f"   Pending AI processing: {pending_count}")
        print()
        
        session.close()
        
        # Summary
        print("╔══════════════════════════════════════════════════════════════════════════════╗")
        print("║                         SETUP COMPLETED SUCCESSFULLY                         ║")
        print("╚══════════════════════════════════════════════════════════════════════════════╝\n")
        
        print("Next Steps:")
        print("  1️⃣  Update bot account credentials (see SQL above)")
        print("  2️⃣  Run scraper: python scraper.py --target <instagram_username>")
        print("  3️⃣  Check scraped data: SELECT * FROM sc_raw_news_feeds WHERE is_processed=false;")
        print()
        
        return True
        
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        print("\nTroubleshooting:")
        print("  - Check .env file exists with correct DB credentials")
        print("  - Verify PostgreSQL is running (Docker: docker-compose up -d)")
        print("  - Test connection: psql -h 127.0.0.1 -p 5433 -U sman1_user -d sman1_baleendah")
        print()
        return False


def reset_database(confirm=False):
    """
    Drop all scraper tables (DESTRUCTIVE)
    Use with caution!
    """
    if not confirm:
        print("⚠️  WARNING: This will DELETE all scraper tables and data!")
        response = input("Type 'YES' to confirm: ")
        if response != 'YES':
            print("❌ Reset cancelled.")
            return
    
    print("🗑️  Dropping scraper tables...")
    engine = create_db_engine()
    Base.metadata.drop_all(engine)
    print("✅ Tables dropped successfully.")
    print("   Run setup again to recreate: python setup_db.py")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--reset':
        reset_database()
    else:
        setup_database()
