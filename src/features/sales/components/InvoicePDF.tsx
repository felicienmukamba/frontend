'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Invoice } from '../types';
import { formatAmountToWords } from '@/lib/numberToWords';

// Standard fonts
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 9,
        fontFamily: 'Helvetica',
        color: '#000',
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
        borderBottomColor: '#000',
        paddingBottom: 5,
    },
    topHeaderLeft: {
        width: '40%',
    },
    topHeaderRight: {
        width: '40%',
        textAlign: 'right',
    },
    logoText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    subLogoText: {
        fontSize: 8,
    },
    normalizedTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#D32F2F',
        textAlign: 'right',
    },
    mainGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    infoBlock: {
        width: '48%',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#AAA',
        padding: 8,
    },
    infoTitle: {
        backgroundColor: '#EEE',
        padding: 4,
        marginBottom: 6,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 10,
    },
    invoiceTitleBlock: {
        textAlign: 'center',
        marginBottom: 20,
    },
    invoiceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textDecoration: 'underline',
    },
    table: {
        display: 'table' as any,
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomColor: '#000',
        borderBottomWidth: 1,
    },
    tableHeader: {
        backgroundColor: '#F0F0F0',
        fontWeight: 'bold',
    },
    col1: { width: '5%', textAlign: 'center', borderRightWidth: 1 },
    col2: { width: '45%', borderRightWidth: 1 },
    col3: { width: '10%', textAlign: 'center', borderRightWidth: 1 }, // [B]
    col4: { width: '15%', textAlign: 'right', borderRightWidth: 1 },
    col5: { width: '10%', textAlign: 'center', borderRightWidth: 1 },
    col6: { width: '15%', textAlign: 'right' },
    cell: { padding: 4 },
    totalsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalsRight: {
        width: '40%',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    amountInWords: {
        marginTop: 10,
        fontStyle: 'italic',
        fontSize: 10,
    },
    securitySection: {
        marginTop: 30,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopStyle: 'dashed',
        borderTopColor: '#000',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    qrPlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    securityInfo: {
        fontSize: 8,
        textAlign: 'right',
    }
});

interface InvoicePDFProps {
    invoice: Invoice;
}

export const InvoicePDF = ({ invoice }: InvoicePDFProps) => {
    const totalHT = Number(invoice.totalAmountExclTax);
    const totalTVA = Number(invoice.totalVAT);
    const totalTTC = Number(invoice.totalAmountInclTax);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* DRC Header */}
                <View style={styles.topHeader}>
                    <View style={styles.topHeaderLeft}>
                        <Text style={styles.logoText}>REPUBLIQUE DEMOCRATIQUE DU CONGO</Text>
                        <Text style={styles.subLogoText}>MINISTERE DES FINANCES</Text>
                        <Text style={styles.subLogoText}>DIRECTION GENERALE DES IMPOTS</Text>
                    </View>
                    <View style={styles.topHeaderRight}>
                        <Text style={styles.normalizedTitle}>FACTURE NORMALISÉE</Text>
                    </View>
                </View>

                {/* Subtitle */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>PRÉSENTATION DE LA RÉFORME</Text>
                </View>

                {/* Contribuable & Client Grid */}
                <View style={styles.mainGrid}>
                    <View style={styles.infoBlock}>
                        <Text style={styles.infoTitle}>ÉMETTEUR (CONTRIBUABLE)</Text>
                        <Text style={{ fontWeight: 'bold' }}>CHEZ MILELE ACCOUNTING</Text>
                        <Text>Point de vente : Kinshasa - Gombe</Text>
                        <Text>NIF : A0702308S</Text>
                        <Text>RCCM : CD/KNH/2024</Text>
                        <Text>Boulevard du 30 Juin, Kinshasa</Text>
                        <Text>Contact : +243 81 000 0000</Text>
                        <Text>Opérateur : SYSTÈME</Text>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.infoTitle}>CLIENT</Text>
                        <Text>Type : CLIENT PHYSIQUE/MORAL</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{invoice.companyId ? `CLIENT ID: ${invoice.companyId}` : 'CLIENT PASSAGER'}</Text>
                        <Text>NIF : {invoice.internalReference || '-'}</Text>
                        <Text>Adresse : Kinshasa, RDC</Text>
                        <Text>Contact : {invoice.companyId || '-'}</Text>
                    </View>
                </View>

                {/* Invoice Title */}
                <View style={styles.invoiceTitleBlock}>
                    <Text style={styles.invoiceTitle}>FACTURE DE VENTE</Text>
                    <Text style={{ marginTop: 5 }}>Facture # {invoice.invoiceNumber || 'BROUILLON'}</Text>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.col1, styles.cell]}>#</Text>
                        <Text style={[styles.col2, styles.cell]}>Designation</Text>
                        <Text style={[styles.col3, styles.cell]}>[B]</Text>
                        <Text style={[styles.col4, styles.cell]}>P.U (TTC)</Text>
                        <Text style={[styles.col5, styles.cell]}>Qté</Text>
                        <Text style={[styles.col6, styles.cell]}>Montant (TTC)</Text>
                    </View>
                    {invoice.invoiceLines?.map((line, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={[styles.col1, styles.cell]}>{index + 1}</Text>
                            <Text style={[styles.col2, styles.cell]}>{line.description || 'Article'}</Text>
                            <Text style={[styles.col3, styles.cell]}>[B]</Text>
                            <Text style={[styles.col4, styles.cell]}>{Number(line.unitPrice * 1.16).toFixed(2)}</Text>
                            <Text style={[styles.col5, styles.cell]}>{line.quantity}</Text>
                            <Text style={[styles.col6, styles.cell]}>{Number(line.totalAmountInclTax).toLocaleString()} {invoice.currency}</Text>
                        </View>
                    ))}
                    {(!invoice.invoiceLines || invoice.invoiceLines.length === 0) && (
                        <View style={styles.tableRow}>
                            <Text style={{ width: '100%', padding: 10, textAlign: 'center' }}>Aucune ligne de facture</Text>
                        </View>
                    )}
                </View>

                {/* Totals Section */}
                <View style={styles.totalsSection}>
                    <View style={{ width: '55%' }}>
                        <Text style={styles.amountInWords}>
                            Arrêté la présente facture à la somme de : {formatAmountToWords(totalTTC, invoice.currency)}
                        </Text>
                        <Text style={{ marginTop: 20 }}>Mode de paiement : ESPECES</Text>
                    </View>
                    <View style={styles.totalsRight}>
                        <View style={styles.totalRow}>
                            <Text>Total H.T. [B] 16%</Text>
                            <Text>{totalHT.toLocaleString()} {invoice.currency}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>Total TVA [B] 16%</Text>
                            <Text>{totalTVA.toLocaleString()} {invoice.currency}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text>EXONERES</Text>
                            <Text>0.00 {invoice.currency}</Text>
                        </View>
                        <View style={[styles.totalRow, { marginTop: 5, borderTop: 1, paddingTop: 5 }]}>
                            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Total TTC:</Text>
                            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{totalTTC.toLocaleString()} {invoice.currency}</Text>
                        </View>
                    </View>
                </View>

                {/* Security Section */}
                <View style={styles.securitySection}>
                    <View style={styles.qrPlaceholder}>
                        <Text style={{ fontSize: 6 }}>QR CODE DGI</Text>
                        <Text style={{ fontSize: 4, marginTop: 4 }}>--- MILELE ---</Text>
                    </View>
                    <View style={styles.securityInfo}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>ÉLÉMENTS DE SÉCURITÉ DE LA FACTURE NORMALISÉE</Text>
                        <Text>ISF: DGI-MILELE-B2C-001</Text>
                        <Text>Code DEF/DGI: {invoice.invoiceNumber}-SECUR-{new Date().getFullYear()}</Text>
                        <Text>DEF NIO: MILELE-NIO-2024</Text>
                        <Text>DEF Compteurs: {Math.floor(Math.random() * 10000)} / {invoice.invoiceLines?.length || 0}</Text>
                        <Text>DEF Heure: {new Date(invoice.issuedAt).toLocaleString()}</Text>
                    </View>
                </View>

                <View style={{ marginTop: 20, textAlign: 'center', color: '#666', fontSize: 7 }}>
                    <Text>Ceci est un exemplaire de facture normalisée conforme aux exigences de la DGI (RDC).</Text>
                </View>
            </Page>
        </Document>
    );
};
