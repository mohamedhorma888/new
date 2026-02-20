/**
 * MemberService
 * Manages library members
 */
import Logger from '../utils/Logger.js';
import { MemberFactory } from '../patterns/Factory.js';
import { MemberNotFoundException } from '../exceptions/LibraryExceptions.js';
import { EventType } from '../patterns/Observer.js';

class MemberService {
  constructor(eventPublisher) {
    this.members = new Map(); // memberId -> Member
    this.membersByEmail = new Map(); // email -> memberId
    this.eventPublisher = eventPublisher;
    Logger.log('MemberService initialized');
  }

  /**
   * Register a new member
   */
  registerMember(id, name, email, phone) {
    if (this.members.has(id)) {
      throw new Error(`Member with ID ${id} already exists`);
    }

    const member = MemberFactory.create(id, name, email, phone);
    this.members.set(id, member);
    this.membersByEmail.set(email, id);

    this.eventPublisher.publishEvent(EventType.MEMBER_STATUS_CHANGED, {
      memberId: id,
      name: name,
      status: 'REGISTERED',
      newStatus: member.status,
    });

    Logger.log(`Member registered: ${name}`, { id, email });
    return member;
  }

  /**
   * Get a member by ID
   */
  getMember(memberId) {
    if (!this.members.has(memberId)) {
      throw new MemberNotFoundException(memberId);
    }
    return this.members.get(memberId);
  }

  /**
   * Get a member by email
   */
  getMemberByEmail(email) {
    const memberId = this.membersByEmail.get(email);
    if (!memberId) {
      throw new MemberNotFoundException(email);
    }
    return this.getMember(memberId);
  }

  /**
   * Get all members
   */
  getAllMembers() {
    return Array.from(this.members.values());
  }

  /**
   * Add fine to member account
   */
  addFine(memberId, amount) {
    const member = this.getMember(memberId);
    const oldStatus = member.status;
    member.addFine(amount);

    if (oldStatus !== member.status) {
      this.eventPublisher.publishEvent(EventType.MEMBER_STATUS_CHANGED, {
        memberId,
        name: member.name,
        previousStatus: oldStatus,
        newStatus: member.status,
      });
    }

    Logger.log(`Fine added to member: ${memberId}`, { amount, newBalance: member.fineBalance });
    return member;
  }

  /**
   * Collect fine payment from member
   */
  payFine(memberId, amount) {
    const member = this.getMember(memberId);
    const oldStatus = member.status;
    member.payFine(amount);

    if (oldStatus !== member.status) {
      this.eventPublisher.publishEvent(EventType.MEMBER_STATUS_CHANGED, {
        memberId,
        name: member.name,
        previousStatus: oldStatus,
        newStatus: member.status,
      });
    }

    Logger.log(`Fine payment received from member: ${memberId}`, { amount, newBalance: member.fineBalance });
    return member;
  }

  /**
   * Check if member can borrow
   */
  canBorrow(memberId) {
    const member = this.getMember(memberId);
    return member.canBorrow();
  }

  /**
   * Record book checkout for member
   */
  checkoutBook(memberId, bookCopyId) {
    const member = this.getMember(memberId);
    member.checkout(bookCopyId);
    Logger.debug(`Book checkout recorded for member: ${memberId}`, { bookCopyId });
  }

  /**
   * Record book return for member
   */
  returnBook(memberId, bookCopyId) {
    const member = this.getMember(memberId);
    member.return(bookCopyId);
    Logger.debug(`Book return recorded for member: ${memberId}`, { bookCopyId });
  }

  /**
   * Get active members (with current checkouts)
   */
  getActiveMembers() {
    return this.getAllMembers().filter(member => member.getCurrentCheckouts() > 0);
  }

  /**
   * Get members with outstanding fines
   */
  getMembersWithFines() {
    return this.getAllMembers().filter(member => member.fineBalance > 0);
  }

  /**
   * Get member statistics
   */
  getMemberStats() {
    const allMembers = this.getAllMembers();
    return {
      totalMembers: allMembers.length,
      activeMembers: this.getActiveMembers().length,
      membersWithFines: this.getMembersWithFines().length,
      totalFines: allMembers.reduce((sum, m) => sum + m.fineBalance, 0),
    };
  }
}

export default MemberService;
