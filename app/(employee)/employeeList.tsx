import { useDeleteEmployee, useEmployees } from '@/hooks/useEmployee';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Pressable,
    Modal,
    ActivityIndicator,
    Linking,
    Platform,
    Alert,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PURPLE = '#58276D';
const LIGHT_BG = '#F5F5F5';
const CARD_BG = '#FFFFFF';
const TAG_BG = '#F5E6C8';
const TAG_TEXT = '#C8860A';

function normalizePhoneForDial(employee: { phone_number?: string; phone?: string } | null | undefined): string | null {
    if (!employee) return null;
    const raw = employee.phone_number ?? employee.phone ?? '';
    const digits = String(raw).replace(/\D/g, '');
    if (!digits.length) return null;
    if (digits.startsWith('92') && digits.length >= 10) return `+${digits}`;
    if (digits.length === 10) return `+92${digits}`;
    return `+${digits}`;
}

function normalizeEmail(employee: { email?: string } | null | undefined): string | null {
    if (!employee) return null;
    const e = (employee.email ?? '').trim();
    return e.length ? e : null;
}

function openExternalUrl(url: string) {
    Linking.openURL(url).catch(() => {
        Alert.alert('Unable to open', 'No app available to handle this action.');
    });
}

function ContactModal({ employee }: { employee: { name?: string; phone_number?: string; phone?: string; email?: string } | null }) {
    const phone = normalizePhoneForDial(employee);
    const email = normalizeEmail(employee);
    const name = employee?.name ?? '';

    const handleCall = () => {
        if (!phone) {
            Alert.alert('Unavailable', 'No phone number for this employee.');
            return;
        }
        openExternalUrl(`tel:${phone}`);
    };

    const handleSms = () => {
        if (!phone) {
            Alert.alert('Unavailable', 'No phone number for this employee.');
            return;
        }
        const body = encodeURIComponent(`Hi ${name},\n\n`);
        const sep = Platform.OS === 'ios' ? '&' : '?';
        openExternalUrl(`sms:${phone}${sep}body=${body}`);
    };

    const handleEmail = () => {
        if (!email) {
            Alert.alert('Unavailable', 'No email address for this employee.');
            return;
        }
        const subject = encodeURIComponent(`Message from Beesmon`);
        const body = encodeURIComponent(`Hi ${name},\n\n`);
        openExternalUrl(`mailto:${email}?subject=${subject}&body=${body}`);
    };

    return (
        <>
            <Text style={styles.modalTitle}>Contact {name}</Text>
            <Text style={styles.modalSubtitle}>How would you like to contact?</Text>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85} onPress={handleCall}>
                <Text style={styles.actionBtnText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85} onPress={handleSms}>
                <Text style={styles.actionBtnText}>Sms</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85} onPress={handleEmail}>
                <Text style={styles.actionBtnText}>Email</Text>
            </TouchableOpacity>
        </>
    );
}

function ConfirmDelete({
    employeeName,
    onClose,
    onConfirmDelete,
}: {
    employeeName: string;
    onClose: () => void;
    onConfirmDelete: () => void;
}) {
    return (
        <>
            <Text style={styles.modalTitle}>Delete employee</Text>
            <Text style={styles.modalSubtitle}>
                Are you sure you want to delete {employeeName ? `“${employeeName}”` : 'this employee'}? This
                cannot be undone.
            </Text>
            <View style={styles.confirmDeleteActions}>
                <TouchableOpacity
                    style={[styles.confirmDeleteBtn, styles.confirmDeleteBtnCancel]}
                    activeOpacity={0.85}
                    onPress={onClose}
                >
                    <Text style={styles.confirmDeleteBtnCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.confirmDeleteBtn, styles.confirmDeleteBtnDanger]}
                    activeOpacity={0.85}
                    onPress={onConfirmDelete}
                >
                    <Text style={styles.confirmDeleteBtnDangerText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

function ModalContainer({ children, visible, onClose }) {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalBox} onPress={() => { }}>
                    {/* Close button */}
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <View style={styles.closeCircle}>
                            <Text style={styles.closeX}>✕</Text>
                        </View>
                    </TouchableOpacity>
                    {children}
                    
                </Pressable>
            </Pressable>
        </Modal>
    );
}

function EmployeeCard({ employee, onContactPress, onMenuPress }) {
    const dotsRef = useRef(null);

    const handleDotsPress = () => {
        if (dotsRef.current) {
            dotsRef.current.measure((fx, fy, width, height, px, py) => {
                onMenuPress(employee, { y: py + height + 4, right: 16 });
            });
        }
    };
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.employeeName}>{employee.name}</Text>
                <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} onPress={handleDotsPress} ref={dotsRef}>
                    <Text style={styles.menuDots}>⋮</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.roleTag}>
                <Text style={styles.roleText}>{employee.role}</Text>
            </View>

            <Pressable onPress={() => onContactPress(employee)}>
                {/* <Text style={styles.contactText}>{employee.phone_number}</Text> */}
                <Text style={styles.contactText}>{employee.email}</Text>
            </Pressable>
        </View>
    );
}

function DropdownMenu({ visible, position, onClose, onDelete, onUpdate }) {
    if (!visible) return null;

    return (
        <Modal
            transparent
            animationType="none"
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.dropdownOverlay} onPress={onClose}>
                <View
                    style={[
                        styles.dropdownBox,
                        { top: position.y, right: position.right },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                            onClose();
                            onDelete();
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.dropdownItemText}>Delete</Text>
                    </TouchableOpacity>

                    <View style={styles.dropdownDivider} />

                    <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                            onClose();
                            onUpdate();
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.dropdownItemText}>Update</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
}

export default function ManageEmployees() {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ y: 0, right: 16 });

    const { data, isLoading, isError, error } = useEmployees()
    const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

    const handleContactPress = (employee) => {
        setSelectedEmployee(employee);
        setContactModalVisible(true);
    };

    const handleCloseModal = () => {
        setContactModalVisible(false);
        setSelectedEmployee(null);
    };

    const handleMenuPress = (employee, position) => {
        setSelectedEmployee(employee);
        setDropdownPosition(position);
        setDropdownVisible(true);
    };

    const handleDelete = async () => {
        const empId = selectedEmployee?.id ?? selectedEmployee?._id;
        if (empId == null) return;
        await deleteEmployee(String(empId));
    };

    const handleOpenDeleteConfirm = () => {
        setConfirmDeleteVisible(true);
    };

    const handleCloseDeleteConfirm = () => {
        setConfirmDeleteVisible(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await handleDelete();
        } catch (e) {
            Alert.alert('Delete failed', 'Could not delete employee. Please try again.');
        } finally {
            setConfirmDeleteVisible(false);
            setSelectedEmployee(null);
        }
    };

    const handleUpdate = () => {
        const empId = selectedEmployee?.id ?? selectedEmployee?._id;
        if (empId == null) return;
        router.push({
            pathname: '/(employee)/updateEmployee',
            params: { id: String(empId) },
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

            {/* Content */}
            <View style={styles.content}>
                {/* Add new employee button */}
                <View style={styles.addButtonRow}>
                    <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={() => router.push("/newEmployee")}>
                        <Text style={styles.addButtonText}>Add new employee</Text>
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <ActivityIndicator />
                ) : isError ? (
                    <View>
                        <Text>{error ? error.message : "Something went Wrong"}</Text>
                    </View>
                ) : <ScrollView style={styles.employeesContainer}>
                    {/* Employee list */}
                    {data.map((emp) => (
                        <EmployeeCard key={emp.id} employee={emp} onContactPress={handleContactPress} onMenuPress={handleMenuPress} />
                    ))}
                </ScrollView>}
            </View>

            <ModalContainer
                visible={contactModalVisible}
                onClose={handleCloseModal}
            >
                <ContactModal employee={selectedEmployee} />
            </ModalContainer>

            <ModalContainer visible={confirmDeleteVisible} onClose={handleCloseDeleteConfirm}>
                <ConfirmDelete
                    employeeName={selectedEmployee?.name ?? ''}
                    onClose={handleCloseDeleteConfirm}
                    onConfirmDelete={handleConfirmDelete}
                />
            </ModalContainer>

            <DropdownMenu
                visible={dropdownVisible}
                position={dropdownPosition}
                onClose={() => setDropdownVisible(false)}
                onDelete={handleOpenDeleteConfirm}
                onUpdate={handleUpdate}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: PURPLE,
    },
    header: {
        backgroundColor: PURPLE,
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 16,
        // paddingVertical: 14,
    },

    content: {
        flex: 1,
        backgroundColor: LIGHT_BG,
        padding: 16,
    },
    addButtonRow: {
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: PURPLE,
        borderRadius: 8,
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    employeesContainer: {
        flexDirection: "column",
        gap: 5
    },
    card: {
        backgroundColor: CARD_BG,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    employeeName: {
        fontSize: 17,
        fontWeight: '600',
        color: PURPLE,
    },
    menuDots: {
        fontSize: 22,
        color: '#555',
        lineHeight: 22,
    },
    roleTag: {
        alignSelf: 'flex-start',
        backgroundColor: TAG_BG,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginBottom: 12,
    },
    roleText: {
        color: TAG_TEXT,
        fontSize: 13,
        fontWeight: '500',
    },
    contactText: {
        color: '#444',
        fontSize: 14,
        marginBottom: 2,
        textAlign: 'center',
    },
    // ── Contact Modal ──────────────────────────────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    modalBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingTop: 28,
        paddingBottom: 24,
        width: '100%',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    closeBtn: {
        position: 'absolute',
        top: -14,
        right: -14,
        zIndex: 10,
    },
    closeCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E53935',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeX: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        textAlign: 'center',
        marginBottom: 6,
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#777',
        textAlign: 'center',
        marginBottom: 20,
    },
    actionBtn: {
        backgroundColor: PURPLE,
        borderRadius: 8,
        paddingVertical: 13,
        marginBottom: 10,
        alignItems: 'center',
    },
    actionBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    confirmDeleteActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 8,
    },
    confirmDeleteBtn: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 13,
        alignItems: 'center',
    },
    confirmDeleteBtnCancel: {
        backgroundColor: '#ECECEC',
    },
    confirmDeleteBtnCancelText: {
        color: '#333',
        fontSize: 15,
        fontWeight: '600',
    },
    confirmDeleteBtnDanger: {
        backgroundColor: '#E53935',
    },
    confirmDeleteBtnDangerText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },

    // ── Dropdown Menu ──────────────────────────────────────────────────────────
    dropdownOverlay: {
        flex: 1,
    },
    dropdownBox: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        minWidth: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingHorizontal: 20,
        paddingVertical: 13,
    },
    dropdownItemText: {
        fontSize: 15,
        color: '#222',
        fontWeight: '400',
    },
    dropdownDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 12,
    },
});